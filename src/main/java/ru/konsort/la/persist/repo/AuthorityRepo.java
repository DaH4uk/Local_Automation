package ru.konsort.la.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import ru.konsort.la.persist.entity.Authority;

public interface AuthorityRepo extends JpaRepository<Authority, Long> {

}