package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.konsort.la.persist.entity.File;
import ru.konsort.la.persist.entity.Scheme;


public interface SchemesRepo extends JpaRepository<Scheme, Long> {

}
