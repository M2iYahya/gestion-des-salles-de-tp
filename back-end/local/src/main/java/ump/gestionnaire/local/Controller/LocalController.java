/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.Controller;

/**
 *
 * @author yahya
 */

import ump.gestionnaire.local.entity.Local;
import ump.gestionnaire.local.services.LocalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/local")
public class LocalController {
    private final LocalService localService;

    public LocalController(LocalService localService) {
        this.localService = localService;
    }

    @GetMapping
    public List<Local> getAllLocals() {
        return localService.getAllLocals();
    }

    @GetMapping("/{id}")
    public Local getLocalById(@PathVariable Integer id) {
        return localService.getLocalById(id);
    }
    
    @GetMapping("/search/{type}")
    public List<Local> getLocalById(@PathVariable Local.Type type) {
        return localService.getLocalByType(type);
    }
    
    @PostMapping
    public Local createLocal(@RequestBody Local local) {
        return localService.createLocal(local);
    }

    @PutMapping("/{id}")
    public Local updateLocal(@PathVariable Integer id, @RequestBody Local local) {
        return localService.updateLocal(id, local);
    }

    @DeleteMapping("/{id}")
    public void deleteLocal(@PathVariable Integer id) {
        localService.deleteLocal(id);
    }
}

