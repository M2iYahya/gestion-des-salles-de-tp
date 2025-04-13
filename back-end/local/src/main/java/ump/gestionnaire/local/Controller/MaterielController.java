/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.Controller;

/**
 *
 * @author yahya
 */

import ump.gestionnaire.local.entity.Materiel;
import ump.gestionnaire.local.services.MaterielService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiel")
public class MaterielController {
    private final MaterielService materielService;

    public MaterielController(MaterielService materielService) {
        this.materielService = materielService;
    }

    @GetMapping
    public List<Materiel> getAllMateriels() {
        return materielService.getAllMateriels();
    }

    @GetMapping("/{id}")
    public Materiel getMaterielById(@PathVariable Integer id) {
        return materielService.getMaterielById(id);
    }

    @PostMapping
    public Materiel createMateriel(@RequestBody Materiel materiel) {
        return materielService.createMateriel(materiel);
    }

    @PutMapping("/{id}")
    public Materiel updateMateriel(@PathVariable Integer id, @RequestBody Materiel materiel) {
        return materielService.updateMateriel(id, materiel);
    }

    @DeleteMapping("/{id}")
    public void deleteMateriel(@PathVariable Integer id) {
        materielService.deleteMateriel(id);
    }
}

