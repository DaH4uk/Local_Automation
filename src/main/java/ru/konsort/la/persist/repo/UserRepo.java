package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.konsort.la.persist.entity.User;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long> {
    User findByLogin(String login);

    User findOne(Long userId); 
}
