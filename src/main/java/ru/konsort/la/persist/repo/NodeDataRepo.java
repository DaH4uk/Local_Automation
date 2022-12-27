package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.konsort.la.persist.entity.NodeData;

import java.util.List;

public interface NodeDataRepo extends JpaRepository<NodeData, Long> {
    List<NodeData> findBySchemeId(Long id);
}