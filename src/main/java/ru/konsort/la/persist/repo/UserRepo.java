package ru.konsort.la.persist.repo;

import ru.konsort.la.persist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepo extends JpaRepository<User, Long> {
    User findByLogin(String login);

}
