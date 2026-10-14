#pragma once
#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "DHPlayerController.generated.h"

UCLASS()
class DIVIDEDHORIZON_API ADHPlayerController : public APlayerController
{
    GENERATED_BODY()
public:
    virtual void BeginPlay() override;
    virtual void SetupInputComponent() override;
    bool IsRestartArmed() const;
private:
    void TogglePause();
    void RequestRestart();
    double RestartDeadline = -1;
};
