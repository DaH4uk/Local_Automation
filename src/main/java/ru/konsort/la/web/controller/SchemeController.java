package ru.konsort.la.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.konsort.la.persist.entity.LinkData;
import ru.konsort.la.persist.entity.NodeData;
import ru.konsort.la.persist.repo.LinkDataRepo;
import ru.konsort.la.persist.repo.NodeDataRepo;

import java.util.List;

/**
 * Created by Turov Danil on 14.12.2016.
 */
@RestController
public class SchemeController {

    @Autowired
    private LinkDataRepo linkDataRepo;

    @Autowired
    private NodeDataRepo nodeDataRepo;

    @RequestMapping(value = "/scheme/links", method = RequestMethod.GET)
    public @ResponseBody
    List<LinkData> getLinkDataList(){
        return linkDataRepo.findAll();
    }

    @RequestMapping(value = "/scheme/nodes", method = RequestMethod.GET)
    public @ResponseBody
    List<NodeData> getNodeDataList(){
        return nodeDataRepo.findAll();
    }

}
