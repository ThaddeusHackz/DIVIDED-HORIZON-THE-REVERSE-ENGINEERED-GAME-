#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "DHOutpostWorld.generated.h"

class UProceduralMeshComponent;
class UMaterialInterface;
struct FDHObjective
{
    FString Id, Label, Message;
    FVector Position = FVector::ZeroVector;
    float RangeCm = 300;
};

UCLASS()
class DIVIDEDHORIZON_API ADHOutpostWorld : public AActor
{
    GENERATED_BODY()
public:
    ADHOutpostWorld();
    bool BuildOutpost(FString& Error);
    TArray<FDHObjective> Objectives;
    FVector SpawnPosition = FVector(-900, 0, 100);
    FVector ExtractionPosition = FVector(-1900, 0, 115);
    float ExtractionRange = 250;
private:
    UPROPERTY(VisibleAnywhere) TObjectPtr<UProceduralMeshComponent> Visuals;
    UPROPERTY() TObjectPtr<UMaterialInterface> VertexMaterial;
    bool bBuilt = false;
};
