#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "DHCharacter.generated.h"

class UCameraComponent;
UCLASS()
class DIVIDEDHORIZON_API ADHCharacter : public ACharacter
{
    GENERATED_BODY()
public:
    ADHCharacter();
    virtual void Tick(float DeltaSeconds) override;
    virtual void SetupPlayerInputComponent(UInputComponent* Input) override;
    float GetStamina() const { return Stamina; }
    void ResetLocomotion();
    void CancelHeldActions();
private:
    void Forward(float Value);
    void Right(float Value);
    void TurnKeys(float Value);
    void SprintOn() { bSprintHeld = true; }
    void SprintOff() { bSprintHeld = false; }
    void WalkOn() { bWalkHeld = true; }
    void WalkOff() { bWalkHeld = false; }
    void CrouchOn() { Crouch(); }
    void CrouchOff() { UnCrouch(); }
    void Interact();
    UPROPERTY(VisibleAnywhere) TObjectPtr<UCameraComponent> Camera;
    float Stamina = 100;
    float RecoveryDelay = 0;
    bool bSprintHeld = false, bWalkHeld = false, bExhausted = false;
};
