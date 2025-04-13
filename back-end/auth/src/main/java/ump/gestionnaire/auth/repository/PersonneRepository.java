/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.repository;

/**
 *
 * @author yahya
 */

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import ump.gestionnaire.auth.entity.Personne;

public interface PersonneRepository extends JpaRepository<Personne, Long> {
    Optional<Personne> findByEmail(String email);
}

