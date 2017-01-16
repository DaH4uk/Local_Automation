package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.konsort.la.persist.entity.LinkData;

public interface LinkDataRepo extends JpaRepository<LinkData, Long> {

}