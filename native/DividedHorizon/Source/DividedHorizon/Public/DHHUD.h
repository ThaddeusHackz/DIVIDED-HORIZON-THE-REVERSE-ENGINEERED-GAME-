#pragma once
#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "DHHUD.generated.h"

UCLASS()
class DIVIDEDHORIZON_API ADHHUD : public AHUD
{
    GENERATED_BODY()
public:
    virtual void DrawHUD() override;
};
