/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package ump.gestionnaire.user.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ump.gestionnaire.user.entity.Personne;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author dell
 */
public interface PersonneRepository extends JpaRepository<Personne, Integer> {
    // Recherche par nom
    List<Personne> findByNom(String nom);

    // Recherche par CIN
    Optional<Personne> findByCin(String cin);
}