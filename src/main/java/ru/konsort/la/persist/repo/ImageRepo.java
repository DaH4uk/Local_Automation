package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.konsort.la.persist.entity.Image;
import ru.konsort.la.persist.entity.User;


public interface ImageRepo extends JpaRepository<Image, Long> {
    Image findById(Long id);

    Image findBySchemeId(Long id);

    Image deleteBySchemeId(Long id);

}
