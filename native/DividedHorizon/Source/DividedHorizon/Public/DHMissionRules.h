#pragma once
#include <cstdint>
#include <cmath>

// Engine-independent state rules; also compiled by the local C++ test runner.
namespace DHMission
{
    constexpr std::uint8_t AllObjectives = 0b111;
    constexpr std::int32_t SaveSchema = 1;
    inline bool IsValidMask(std::uint8_t Mask) { return (Mask & ~AllObjectives) == 0; }
    inline bool IsCollected(std::uint8_t Mask, int Index)
    {
        return Index >= 0 && Index < 3 && (Mask & (1u << Index)) != 0;
    }
    inline bool Collect(std::uint8_t& Mask, int Index)
    {
        if (!IsValidMask(Mask) || Index < 0 || Index >= 3 || IsCollected(Mask, Index)) return false;
        Mask = static_cast<std::uint8_t>(Mask | (1u << Index));
        return true;
    }
    inline bool CanExtract(std::uint8_t Mask) { return Mask == AllObjectives; }
    inline bool ValidSave(std::int32_t Schema, std::uint8_t Mask, bool Extracted)
    {
        return Schema == SaveSchema && IsValidMask(Mask) && (!Extracted || CanExtract(Mask));
    }
    inline bool InPlayArea(double UE_X, double UE_Y)
    {
        if (!std::isfinite(UE_X) || !std::isfinite(UE_Y)) return false;
        const double X = UE_Y / 100.0, Z = -UE_X / 100.0;
        return (std::hypot(X, Z) < 18.0 && Z <= 10.0)
            || (std::abs(X) < 1.12 && Z >= 9.5 && Z < 21.9);
    }
}
