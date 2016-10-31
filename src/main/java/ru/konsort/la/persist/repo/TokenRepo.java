package ru.konsort.la.persist.repo;

import ru.konsort.la.persist.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepo extends JpaRepository<Token, String> {
}
