#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "DHGameMode.generated.h"

class ADHOutpostWorld;
UCLASS()
class DIVIDEDHORIZON_API ADHGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    ADHGameMode();
    virtual void StartPlay() override;
    void Interact(APlayerController* Player);
    void RestartAssignment(APlayerController* Player);
    void RecoverPlayer(APlayerController* Player);
    FString InteractionPrompt(APlayerController* Player) const;
    const ADHOutpostWorld* GetOutpost() const { return Outpost; }
    uint8 GetMask() const { return ObjectiveMask; }
    bool IsExtracted() const { return bExtracted; }
    bool IsDataReady() const { return bDataReady; }
    FString GetStatus() const { return Status; }
private:
    int32 Candidate(APlayerController* Player) const;
    void LoadProgress();
    bool SaveProgress();
    UPROPERTY() TObjectPtr<ADHOutpostWorld> Outpost;
    uint8 ObjectiveMask = 0;
    bool bExtracted = false;
    bool bDataReady = false;
    FString Status;
};
