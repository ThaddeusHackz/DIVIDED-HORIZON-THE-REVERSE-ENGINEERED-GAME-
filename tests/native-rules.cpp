#include "DHMissionRules.h"
#include "DHMeshFormat.h"
#include <cassert>
#include <fstream>
#include <iostream>
#include <iterator>
#include <limits>

int main(int argc, char** argv)
{
    assert(argc == 2);
    for (int Initial = 0; Initial < 256; ++Initial)
    {
        const auto Mask = static_cast<std::uint8_t>(Initial);
        assert(DHMission::IsValidMask(Mask) == (Initial < 8));
        assert(DHMission::CanExtract(Mask) == (Initial == 7));
        for (int Index = -3; Index < 7; ++Index)
        {
            auto Next = Mask;
            const bool Expected = Initial < 8 && Index >= 0 && Index < 3 && !(Initial & (1 << Index));
            assert(DHMission::Collect(Next, Index) == Expected);
            assert(Next == (Expected ? (Initial | (1 << Index)) : Initial));
        }
        assert(DHMission::ValidSave(1, Mask, false) == (Initial < 8));
        assert(DHMission::ValidSave(1, Mask, true) == (Initial == 7));
        assert(!DHMission::ValidSave(2, Mask, false));
    }
    assert(DHMission::InPlayArea(-900, 0));
    assert(DHMission::InPlayArea(-1900, 0));
    assert(!DHMission::InPlayArea(-1900, 300));
    assert(!DHMission::InPlayArea(-2200, 0));
    assert(!DHMission::InPlayArea(std::numeric_limits<double>::quiet_NaN(), 0));
    std::ifstream File(argv[1], std::ios::binary);
    assert(File.good());
    std::vector<std::uint8_t> Data((std::istreambuf_iterator<char>(File)), {});
    std::vector<DHMesh::Section> Sections; std::string Error;
    assert(DHMesh::Parse(Data.data(), Data.size(), Sections, Error));
    std::size_t Triangles = 0;
    for (const auto& Section : Sections) Triangles += Section.IndexCount / 3;
    assert(Triangles == 92138);
    const auto VertexOffset = Sections.front().VertexOffset;
    const auto IndexOffset = Sections.front().IndexOffset;
    const auto BadIndex = Sections.front().VertexCount;
    // Truncation at multiple boundaries, invalid schema, malicious counts and NaN data.
    for (std::size_t N : {std::size_t(0), std::size_t(11), std::size_t(12), VertexOffset, Data.size()-1})
        assert(!DHMesh::Parse(Data.data(), N, Sections, Error));
    auto Changed = Data; Changed[0] = 'X'; assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; Changed[4] = 2; assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; Changed[8] = 255; assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; for (int I=0; I<4; ++I) Changed[12+I] = 255;
    assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; const std::uint32_t NaN = 0x7fc00000;
    for (int I=0; I<4; ++I) Changed[VertexOffset+I] = (NaN >> (I*8)) & 255;
    assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; for (int I=0; I<4; ++I) Changed[IndexOffset+I] = (BadIndex >> (I*8)) & 255;
    assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    Changed = Data; Changed.push_back(0); assert(!DHMesh::Parse(Changed.data(), Changed.size(), Sections, Error));
    std::cout << "PASS: exhaustive mission masks, save schema, shoreline bounds, real 92,138-triangle mesh, and malformed-mesh rejection.\n";
    std::cout << "NOT TESTED: Unreal compilation, editor preparation, native gameplay, cook, Win64 packaging or launch.\n";
}
