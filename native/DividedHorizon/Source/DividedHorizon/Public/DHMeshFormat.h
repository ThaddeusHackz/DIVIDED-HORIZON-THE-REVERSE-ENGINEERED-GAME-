#pragma once
#include <cstdint>
#include <cstddef>
#include <cstring>
#include <cmath>
#include <string>
#include <vector>

// Strict parser shared by native runtime and the engine-independent C++ tests.
// Files are little-endian; no pointer casts, native struct packing or UE types.
namespace DHMesh
{
    struct Section
    {
        std::uint32_t VertexCount = 0, IndexCount = 0;
        float Roughness = 1, Metallic = 0;
        std::size_t VertexOffset = 0, IndexOffset = 0;
    };
    inline std::uint32_t U32(const std::uint8_t* P)
    {
        return std::uint32_t(P[0]) | (std::uint32_t(P[1]) << 8)
            | (std::uint32_t(P[2]) << 16) | (std::uint32_t(P[3]) << 24);
    }
    inline float F32(const std::uint8_t* P)
    {
        const auto Bits = U32(P); float Value; std::memcpy(&Value, &Bits, sizeof(Value)); return Value;
    }
    inline bool Parse(const std::uint8_t* Data, std::size_t Size,
                      std::vector<Section>& Out, std::string& Error)
    {
        Out.clear(); Error.clear();
        auto Fail = [&](const char* Message) { Out.clear(); Error = Message; return false; };
        if (!Data || Size < 12 || Size > 64u * 1024u * 1024u) return Fail("Invalid mesh byte count");
        if (std::memcmp(Data, "DHMS", 4) || U32(Data + 4) != 1) return Fail("Wrong magic or mesh schema");
        const auto Count = U32(Data + 8);
        if (Count == 0 || Count > 128) return Fail("Invalid section count");
        std::size_t Offset = 12, TotalVertices = 0;
        for (std::uint32_t S = 0; S < Count; ++S)
        {
            if (Size - Offset < 16) return Fail("Truncated section header");
            Section Part;
            Part.VertexCount = U32(Data + Offset); Part.IndexCount = U32(Data + Offset + 4);
            Part.Roughness = F32(Data + Offset + 8); Part.Metallic = F32(Data + Offset + 12); Offset += 16;
            if (Part.VertexCount == 0 || Part.VertexCount > 1000000 || Part.IndexCount == 0
                || Part.IndexCount > 3000000 || Part.IndexCount % 3) return Fail("Invalid mesh counts");
            TotalVertices += Part.VertexCount;
            if (TotalVertices > 1000000) return Fail("Vertex budget exceeded");
            if (!std::isfinite(Part.Roughness) || Part.Roughness < 0 || Part.Roughness > 1
                || !std::isfinite(Part.Metallic) || Part.Metallic < 0 || Part.Metallic > 1) return Fail("Invalid material factors");
            const std::size_t VertexBytes = std::size_t(Part.VertexCount) * 40;
            const std::size_t IndexBytes = std::size_t(Part.IndexCount) * 4;
            if (VertexBytes + IndexBytes > Size - Offset) return Fail("Truncated vertex or index buffer");
            Part.VertexOffset = Offset; Part.IndexOffset = Offset + VertexBytes;
            for (std::uint32_t V = 0; V < Part.VertexCount; ++V)
            {
                const auto* P = Data + Offset + std::size_t(V) * 40;
                for (int C = 0; C < 10; ++C)
                {
                    const float Value = F32(P + C * 4);
                    if (!std::isfinite(Value)) return Fail("Non-finite vertex component");
                    if (C < 3 && std::abs(Value) > 1000000) return Fail("Position outside prototype bounds");
                    if (C >= 6 && (Value < 0 || Value > 1)) return Fail("Invalid linear vertex color");
                }
                const float X = F32(P + 12), Y = F32(P + 16), Z = F32(P + 20);
                const float Length2 = X * X + Y * Y + Z * Z;
                if (Length2 < .9f || Length2 > 1.1f) return Fail("Non-unit vertex normal");
            }
            for (std::uint32_t I = 0; I < Part.IndexCount; ++I)
                if (U32(Data + Part.IndexOffset + std::size_t(I) * 4) >= Part.VertexCount) return Fail("Index outside vertex buffer");
            Offset += VertexBytes + IndexBytes; Out.push_back(Part);
        }
        if (Offset != Size) return Fail("Unexpected trailing mesh data");
        return true;
    }
}
