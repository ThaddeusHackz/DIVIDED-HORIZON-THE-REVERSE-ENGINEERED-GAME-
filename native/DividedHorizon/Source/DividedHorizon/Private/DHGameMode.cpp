#include "DHGameMode.h"
#include "DHCharacter.h"
#include "DHPlayerController.h"
#include "DHHUD.h"
#include "DHOutpostWorld.h"
#include "DHMissionRules.h"
#include "DHSaveGame.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "Engine/HitResult.h"
#include "CollisionQueryParams.h"
#include "GameFramework/CharacterMovementComponent.h"

namespace { const FString SaveSlot(TEXT("DH_PuertoChico_Prototype_v1")); }
ADHGameMode::ADHGameMode()
{
    DefaultPawnClass = ADHCharacter::StaticClass();
    PlayerControllerClass = ADHPlayerController::StaticClass();
    HUDClass = ADHHUD::StaticClass();
}
void ADHGameMode::StartPlay()
{
    Outpost = GetWorld()->SpawnActor<ADHOutpostWorld>();
    FString Error;
    bDataReady = Outpost && Outpost->BuildOutpost(Error);
    if (!bDataReady)
    {
        Status = TEXT("BUILD DATA ERROR: ") + Error;
        UE_LOG(LogTemp, Error, TEXT("%s"), *Status);
    }
    else
    {
        Status = TEXT("Find the cargo manifest, inspect the ledger, and restore the signal.");
        LoadProgress();
    }
    Super::StartPlay();
}
int32 ADHGameMode::Candidate(APlayerController* Player) const
{
    if (!bDataReady || !Player || !Player->GetPawn() || Player->IsPaused() || bExtracted) return INDEX_NONE;
    FVector Eye; FRotator Rotation; Player->GetPlayerViewPoint(Eye, Rotation);
    FCollisionQueryParams Query(SCENE_QUERY_STAT(DHInteraction), false, Player->GetPawn());
    for (int32 I = 0; I < Outpost->Objectives.Num(); ++I)
    {
        if (DHMission::IsCollected(ObjectiveMask, I)) continue;
        const auto& Goal = Outpost->Objectives[I]; const FVector Delta = Goal.Position - Eye;
        if (Delta.SizeSquared() > FMath::Square(Goal.RangeCm) || FVector::DotProduct(Rotation.Vector(), Delta.GetSafeNormal()) < .35f) continue;
        FHitResult Hit;
        if (!GetWorld()->LineTraceSingleByChannel(Hit, Eye, Goal.Position, ECC_Visibility, Query)) return I;
    }
    if (DHMission::CanExtract(ObjectiveMask)
        && FVector::Dist(Player->GetPawn()->GetActorLocation(), Outpost->ExtractionPosition) < Outpost->ExtractionRange) return 3;
    return INDEX_NONE;
}
FString ADHGameMode::InteractionPrompt(APlayerController* Player) const
{
    const int32 Index = Candidate(Player);
    if (Index == 3) return TEXT("[E] Secure the evidence");
    return Index == INDEX_NONE ? FString() : TEXT("[E] ") + Outpost->Objectives[Index].Label;
}
void ADHGameMode::Interact(APlayerController* Player)
{
    const int32 Index = Candidate(Player);
    if (Index == 3) { bExtracted = true; Status = TEXT("EVIDENCE SECURED. Assignment complete. Press R twice to restart."); }
    else if (DHMission::Collect(ObjectiveMask, Index)) Status = Outpost->Objectives[Index].Message;
    else return;
    if (!SaveProgress()) Status += TEXT(" [SAVE FAILED: progress remains in memory only.]");
}
void ADHGameMode::LoadProgress()
{
    if (!UGameplayStatics::DoesSaveGameExist(SaveSlot, 0)) return;
    UDHSaveGame* Save = Cast<UDHSaveGame>(UGameplayStatics::LoadGameFromSlot(SaveSlot, 0));
    if (!Save || !DHMission::ValidSave(Save->Schema, Save->ObjectiveMask, Save->bExtracted))
    { Status = TEXT("Existing prototype save is incompatible or corrupt. It was not loaded. R twice starts a fresh assignment."); return; }
    ObjectiveMask = Save->ObjectiveMask; bExtracted = Save->bExtracted;
    Status = bExtracted ? TEXT("Evidence already secured. R twice starts a fresh assignment.") : TEXT("Objective progress restored. You are back at the harbor approach.");
}
bool ADHGameMode::SaveProgress()
{
    UDHSaveGame* Save = Cast<UDHSaveGame>(UGameplayStatics::CreateSaveGameObject(UDHSaveGame::StaticClass()));
    if (!Save) return false;
    Save->Schema = DHMission::SaveSchema; Save->ObjectiveMask = ObjectiveMask; Save->bExtracted = bExtracted;
    return UGameplayStatics::SaveGameToSlot(Save, SaveSlot, 0);
}
void ADHGameMode::RecoverPlayer(APlayerController* Player)
{
    if (!bDataReady || !Player || !Player->GetPawn()) return;
    if (ADHCharacter* Character = Cast<ADHCharacter>(Player->GetPawn())) Character->ResetLocomotion();
    Player->GetPawn()->SetActorLocation(Outpost->SpawnPosition, false, nullptr, ETeleportType::TeleportPhysics);
    Player->SetControlRotation(FRotator::ZeroRotator);
    Status = TEXT("Returned to the shore. Swimming is not implemented in this prototype.");
}
void ADHGameMode::RestartAssignment(APlayerController* Player)
{
    if (!bDataReady) return;
    ObjectiveMask = 0; bExtracted = false;
    if (Player) Player->SetPause(false);
    RecoverPlayer(Player);
    Status = SaveProgress() ? TEXT("New assignment. All three objectives reset.") : TEXT("Assignment reset, but save write failed.");
}
