/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.user.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ump.gestionnaire.user.entity.Personne;
import ump.gestionnaire.user.repository.PersonneRepository;

import java.util.List;
import java.util.Optional;
/**
 *
 * @author dell
 */
@Service
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    // Ajouter un utilisateur
    public Personne ajouterPersonne(Personne personne) {
        return personneRepository.save(personne);
    }

    // Modifier un utilisateur
    public Personne modifierPersonne(int id, Personne updatedPersonne) {
        Optional<Personne> existingPersonne = personneRepository.findById(id);
        if (existingPersonne.isPresent()) {
            Personne personne = existingPersonne.get();
            personne.setNom(updatedPersonne.getNom());
            personne.setPrenom(updatedPersonne.getPrenom());
            personne.setDateNaissance(updatedPersonne.getDateNaissance());
            personne.setEmail(updatedPersonne.getEmail());
            personne.setCin(updatedPersonne.getCin());
            personne.setTelephone(updatedPersonne.getTelephone());
            personne.setGrade(updatedPersonne.getGrade());
            personne.setResponsabilite(updatedPersonne.getResponsabilite());
            personne.setAdresse(updatedPersonne.getAdresse());
            personne.setVille(updatedPersonne.getVille());
            personne.setCodePostal(updatedPersonne.getCodePostal());
            personne.setNomBanque(updatedPersonne.getNomBanque());
            personne.setNumeroSom(updatedPersonne.getNumeroSom());
            return personneRepository.save(personne);
        }
        throw new RuntimeException("Personne non trouvée");
    }

    // Supprimer un utilisateur
    public void supprimerPersonne(int id) {
        personneRepository.deleteById(id);
    }

    // Afficher tous les utilisateurs
    public List<Personne> afficherTousLesUtilisateurs() {
        return personneRepository.findAll();
    }

    // Afficher un utilisateur par ID
    public Personne afficherUtilisateurParId(int id) {
        return personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personne non trouvée"));
    }
    // Recherche par nom
    public List<Personne> rechercherParNom(String nom) {
        List<Personne> personnes = personneRepository.findByNom(nom);
        if (personnes.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur trouvé avec le nom : " + nom);
        }
        return personnes;
    }

    // Recherche par CIN
    public Personne rechercherParCin(String cin) {
        return personneRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur avec le CIN " + cin + " non trouvé"));
    }
}

