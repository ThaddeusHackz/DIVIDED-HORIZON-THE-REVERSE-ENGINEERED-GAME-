#pragma once
#include "CoreMinimal.h"
#include "GameFramework/SaveGame.h"
#include "DHSaveGame.generated.h"

UCLASS()
class DIVIDEDHORIZON_API UDHSaveGame : public USaveGame
{
    GENERATED_BODY()
public:
    UPROPERTY(SaveGame) int32 Schema = 1;
    UPROPERTY(SaveGame) uint8 ObjectiveMask = 0;
    UPROPERTY(SaveGame) bool bExtracted = false;
};
