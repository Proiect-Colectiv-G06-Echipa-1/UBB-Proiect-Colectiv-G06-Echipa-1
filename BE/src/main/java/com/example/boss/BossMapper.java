package com.example.boss;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BossMapper {
    BossDTO toDTO(Boss entity);

    Boss toEntity(BossDTO dto);
}