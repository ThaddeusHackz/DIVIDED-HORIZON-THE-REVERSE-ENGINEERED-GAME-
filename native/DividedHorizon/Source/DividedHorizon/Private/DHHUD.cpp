#include "DHHUD.h"
#include "DHGameMode.h"
#include "DHOutpostWorld.h"
#include "DHCharacter.h"
#include "DHPlayerController.h"
#include "DHMissionRules.h"
#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "Engine/World.h"

void ADHHUD::DrawHUD()
{
    Super::DrawHUD();
    if (!Canvas || !GEngine || !PlayerOwner) return;
    const auto* Mode = GetWorld()->GetAuthGameMode<ADHGameMode>(); if (!Mode) return;
    const float Scale = FMath::Clamp(Canvas->ClipX / 1440.f, .75f, 1.8f);
    const FLinearColor Cream(.95f, .92f, .79f), Gold(.91f, .68f, .3f), Green(.54f, .77f, .48f);
    auto Text = [&](const FString& Value, float X, float Y, FLinearColor Color = FLinearColor::White)
    { DrawText(Value, Color, X * Scale, Y * Scale, GEngine->GetSmallFont(), Scale); };
    DrawRect(FLinearColor(.025f, .07f, .05f, .88f), 20 * Scale, 20 * Scale, 430 * Scale, 252 * Scale);
    Text(TEXT("DIVIDED HORIZON / NATIVE PROTOTYPE"), 36, 34, Gold);
    Text(TEXT("PUERTO CHICO — LA ADUANA"), 36, 60, Cream);
    if (const auto* World = Mode->GetOutpost(); Mode->IsDataReady() && World)
    {
        for (int32 I = 0; I < World->Objectives.Num(); ++I)
        {
            const bool bDone = DHMission::IsCollected(Mode->GetMask(), I);
            Text((bDone ? TEXT("[x] ") : TEXT("[ ] ")) + World->Objectives[I].Label, 36, 102 + I * 28, bDone ? Green : Cream);
        }
        if (DHMission::CanExtract(Mode->GetMask()))
            Text(Mode->IsExtracted() ? TEXT("EVIDENCE SECURED") : TEXT("Return to the end of the jetty"), 36, 199, Gold);
    }
    if (const auto* Character = Cast<ADHCharacter>(PlayerOwner->GetPawn()))
        Text(FString::Printf(TEXT("STAMINA  %03.0f / 100"), Character->GetStamina()), 36, 239, Cream);
    DrawText(TEXT("+"), Cream, Canvas->ClipX * .5f, Canvas->ClipY * .5f, GEngine->GetSmallFont(), Scale);
    const FString Prompt = Mode->InteractionPrompt(PlayerOwner);
    if (!Prompt.IsEmpty()) DrawText(Prompt, Gold, Canvas->ClipX * .35f, Canvas->ClipY * .66f, GEngine->GetSmallFont(), Scale);
    // Break long status text into bounded rows rather than letting it run off screen.
    TArray<FString> Words; Mode->GetStatus().ParseIntoArray(Words, TEXT(" "), true);
    FString Line; float Y = Canvas->ClipY - 120 * Scale;
    for (const FString& Word : Words)
    {
        if (Line.Len() + Word.Len() > 88)
        { DrawText(Line, Cream, 30 * Scale, Y, GEngine->GetSmallFont(), Scale); Y += 20 * Scale; Line.Empty(); }
        Line += Word + TEXT(" ");
    }
    DrawText(Line, Cream, 30 * Scale, Y, GEngine->GetSmallFont(), Scale);
    DrawText(TEXT("WASD move | Mouse look | Shift sprint | Alt walk | Ctrl crouch | Space jump | E interact | Esc pause | R restart"),
        Cream, 30 * Scale, Canvas->ClipY - 30 * Scale, GEngine->GetSmallFont(), Scale * .85f);
    const auto* Controller = Cast<ADHPlayerController>(PlayerOwner);
    if (PlayerOwner->IsPaused() || (Controller && Controller->IsRestartArmed()))
    {
        DrawRect(FLinearColor(0, .03f, .02f, .92f), Canvas->ClipX * .25f, Canvas->ClipY * .37f, Canvas->ClipX * .5f, 130 * Scale);
        DrawText(Controller && Controller->IsRestartArmed() ? TEXT("Press R again within 3 seconds to erase prototype progress.") : TEXT("PAUSED — Esc resumes. R twice starts a new assignment."),
            Cream, Canvas->ClipX * .28f, Canvas->ClipY * .4f, GEngine->GetSmallFont(), Scale);
    }
}
