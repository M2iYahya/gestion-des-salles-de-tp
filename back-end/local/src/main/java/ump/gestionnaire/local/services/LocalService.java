/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.services;

/**
 *
 * @author yahya
 */

import ump.gestionnaire.local.entity.Local;
import ump.gestionnaire.local.repository.LocalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocalService {
    private final LocalRepository localRepository;

    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }
    
    public List<Local> getAllLocals() {
        return localRepository.findAll();
    }

    public Local getLocalById(Integer id) {
        return localRepository.findById(id).orElseThrow(() -> new RuntimeException("Local not found"));
    }

    public List<Local> getLocalByType(Local.Type type) {
        return localRepository.findByType(type);
    }
    
    public Local createLocal(Local local) {
        return localRepository.save(local);
    }

    public Local updateLocal(Integer id, Local updatedLocal) {
        Local existingLocal = getLocalById(id);
        existingLocal.setType(updatedLocal.getType());
        existingLocal.setCapacite(updatedLocal.getCapacite());
        existingLocal.setDisponibilite(updatedLocal.getDisponibilite());
        existingLocal.setBatiment(updatedLocal.getBatiment());
        existingLocal.setNumeroSalle(updatedLocal.getNumeroSalle());
        existingLocal.setImageLocal(updatedLocal.getImageLocal());
        return localRepository.save(existingLocal);
    }

    public void deleteLocal(Integer id) {
        localRepository.deleteById(id);
    }
}
