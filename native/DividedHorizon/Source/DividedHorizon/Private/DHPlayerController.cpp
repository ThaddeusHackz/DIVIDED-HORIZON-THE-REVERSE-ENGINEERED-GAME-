#include "DHPlayerController.h"
#include "DHGameMode.h"
#include "DHCharacter.h"
#include "Components/InputComponent.h"
#include "GameFramework/PlayerInput.h"
#include "Engine/World.h"

void ADHPlayerController::BeginPlay()
{
    Super::BeginPlay(); bShowMouseCursor = false; SetInputMode(FInputModeGameOnly());
}
void ADHPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    InputComponent->BindAction(TEXT("Pause"), IE_Pressed, this, &ADHPlayerController::TogglePause).bExecuteWhenPaused = true;
    InputComponent->BindAction(TEXT("RestartAssignment"), IE_Pressed, this, &ADHPlayerController::RequestRestart).bExecuteWhenPaused = true;
}
void ADHPlayerController::TogglePause()
{
    SetPause(!IsPaused());
    if (auto* Character = Cast<ADHCharacter>(GetPawn())) Character->CancelHeldActions();
    if (PlayerInput) PlayerInput->FlushPressedKeys();
}
bool ADHPlayerController::IsRestartArmed() const { return GetWorld() && GetWorld()->GetRealTimeSeconds() < RestartDeadline; }
void ADHPlayerController::RequestRestart()
{
    if (!IsRestartArmed()) { RestartDeadline = GetWorld()->GetRealTimeSeconds() + 3; return; }
    RestartDeadline = -1;
    if (auto* Mode = GetWorld()->GetAuthGameMode<ADHGameMode>()) Mode->RestartAssignment(this);
}
