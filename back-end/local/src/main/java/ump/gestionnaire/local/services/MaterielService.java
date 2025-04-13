/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.services;

/**
 *
 * @author yahya
 */

import ump.gestionnaire.local.entity.Materiel;
import ump.gestionnaire.local.repository.MaterielRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterielService {
    private final MaterielRepository materielRepository;

    public MaterielService(MaterielRepository materielRepository) {
        this.materielRepository = materielRepository;
    }

    public List<Materiel> getAllMateriels() {
        return materielRepository.findAll();
    }

    public Materiel getMaterielById(Integer id) {
        return materielRepository.findById(id).orElseThrow(() -> new RuntimeException("Materiel not found"));
    }

    public Materiel createMateriel(Materiel materiel) {
        return materielRepository.save(materiel);
    }

    public Materiel updateMateriel(Integer id, Materiel updatedMateriel) {
        Materiel existingMateriel = getMaterielById(id);
        existingMateriel.setNom(updatedMateriel.getNom());
        existingMateriel.setType(updatedMateriel.getType());
        existingMateriel.setQuantite(updatedMateriel.getQuantite());
        return materielRepository.save(existingMateriel);
    }

    public void deleteMateriel(Integer id) {
        materielRepository.deleteById(id);
    }
}
