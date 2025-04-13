/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.repository;

/**
 *
 * @author yahya
 */

import ump.gestionnaire.local.entity.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocalRepository extends JpaRepository<Local, Integer> {
    List<Local> findByType(Local.Type type);
}