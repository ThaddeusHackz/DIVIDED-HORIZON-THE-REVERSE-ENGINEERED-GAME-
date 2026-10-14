#include "DHCharacter.h"
#include "DHGameMode.h"
#include "DHMissionRules.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerController.h"
#include "Engine/World.h"

ADHCharacter::ADHCharacter()
{
    PrimaryActorTick.bCanEverTick = true;
    GetCapsuleComponent()->InitCapsuleSize(25, 96);
    Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
    Camera->SetupAttachment(GetCapsuleComponent()); Camera->SetRelativeLocation(FVector(0, 0, 64));
    Camera->bUsePawnControlRotation = true; Camera->FieldOfView = 80;
    bUseControllerRotationYaw = true;
    auto* Movement = GetCharacterMovement();
    Movement->MaxWalkSpeed = 340; Movement->MaxWalkSpeedCrouched = 130;
    Movement->MaxStepHeight = 45; Movement->JumpZVelocity = 420;
    Movement->MaxAcceleration = 1800; Movement->BrakingDecelerationWalking = 2200;
    Movement->GetNavAgentPropertiesRef().bCanCrouch = true;
    Movement->SetCrouchedHalfHeight(58);
}
void ADHCharacter::SetupPlayerInputComponent(UInputComponent* Input)
{
    Super::SetupPlayerInputComponent(Input);
    Input->BindAxis(TEXT("MoveForward"), this, &ADHCharacter::Forward);
    Input->BindAxis(TEXT("MoveRight"), this, &ADHCharacter::Right);
    Input->BindAxis(TEXT("Turn"), this, &ADHCharacter::AddControllerYawInput);
    Input->BindAxis(TEXT("LookUp"), this, &ADHCharacter::AddControllerPitchInput);
    Input->BindAxis(TEXT("TurnKeys"), this, &ADHCharacter::TurnKeys);
    Input->BindAction(TEXT("Jump"), IE_Pressed, this, &ADHCharacter::Jump);
    Input->BindAction(TEXT("Jump"), IE_Released, this, &ADHCharacter::StopJumping);
    Input->BindAction(TEXT("Sprint"), IE_Pressed, this, &ADHCharacter::SprintOn);
    Input->BindAction(TEXT("Sprint"), IE_Released, this, &ADHCharacter::SprintOff);
    Input->BindAction(TEXT("Walk"), IE_Pressed, this, &ADHCharacter::WalkOn);
    Input->BindAction(TEXT("Walk"), IE_Released, this, &ADHCharacter::WalkOff);
    Input->BindAction(TEXT("Crouch"), IE_Pressed, this, &ADHCharacter::CrouchOn);
    Input->BindAction(TEXT("Crouch"), IE_Released, this, &ADHCharacter::CrouchOff);
    Input->BindAction(TEXT("Interact"), IE_Pressed, this, &ADHCharacter::Interact);
}
void ADHCharacter::Forward(float Value)
{
    if (Controller) AddMovementInput(FRotationMatrix(FRotator(0, Controller->GetControlRotation().Yaw, 0)).GetUnitAxis(EAxis::X), Value);
}
void ADHCharacter::Right(float Value)
{
    if (Controller) AddMovementInput(FRotationMatrix(FRotator(0, Controller->GetControlRotation().Yaw, 0)).GetUnitAxis(EAxis::Y), Value);
}
void ADHCharacter::TurnKeys(float Value) { AddControllerYawInput(Value * GetWorld()->GetDeltaSeconds() * 80); }
void ADHCharacter::Interact()
{
    if (auto* Mode = GetWorld()->GetAuthGameMode<ADHGameMode>()) Mode->Interact(Cast<APlayerController>(Controller));
}
void ADHCharacter::CancelHeldActions()
{
    bSprintHeld = bWalkHeld = false; StopJumping(); UnCrouch();
}
void ADHCharacter::ResetLocomotion()
{
    CancelHeldActions(); bExhausted = false;
    Stamina = 100; RecoveryDelay = 0;
    GetCharacterMovement()->StopMovementImmediately();
}
void ADHCharacter::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    auto* Movement = GetCharacterMovement();
    const bool bSprinting = bSprintHeld && !bWalkHeld && !bIsCrouched && !bExhausted
        && Movement->IsMovingOnGround() && GetVelocity().SizeSquared2D() > 1;
    if (bSprinting)
    {
        Stamina = FMath::Max(0.f, Stamina - (100.f / 9.f) * DeltaSeconds);
        RecoveryDelay = 1.8f; if (Stamina <= 0) bExhausted = true;
    }
    else
    {
        RecoveryDelay = FMath::Max(0.f, RecoveryDelay - DeltaSeconds);
        if (RecoveryDelay <= 0) Stamina = FMath::Min(100.f, Stamina + 14.f * DeltaSeconds);
        if (Stamina >= 20) bExhausted = false;
    }
    Movement->MaxWalkSpeed = bSprinting ? 620 : (bWalkHeld ? 160 : 340);
    FVector CameraOffset = Camera->GetRelativeLocation();
    CameraOffset.Z = FMath::FInterpTo(CameraOffset.Z, bIsCrouched ? 40.f : 64.f, DeltaSeconds, 10.f);
    Camera->SetRelativeLocation(CameraOffset);
    if (auto* Mode = GetWorld()->GetAuthGameMode<ADHGameMode>())
    {
        const FVector P = GetActorLocation();
        if (Mode->IsDataReady() && (P.Z < -400 || !DHMission::InPlayArea(P.X, P.Y)))
            Mode->RecoverPlayer(Cast<APlayerController>(Controller));
    }
}
