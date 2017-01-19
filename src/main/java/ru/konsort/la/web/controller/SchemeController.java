package ru.konsort.la.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
    private static final Logger logger = LoggerFactory.getLogger(SchemeController.class);


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

    @RequestMapping(value = "/scheme/links", method = RequestMethod.POST)
    public @ResponseBody List<LinkData> saveLinkDataList(@RequestBody List<LinkData> linkDataList){
        logger.debug("save linkDataList");
        linkDataRepo.deleteAll();
        linkDataRepo.save(linkDataList);
        linkDataRepo.flush();
        return linkDataList;
    }

    @RequestMapping(value = "/scheme/nodes", method = RequestMethod.POST)
    public @ResponseBody List<NodeData> saveNodeDataList(@RequestBody List<NodeData> nodeDataList){
        logger.debug("save nodeDataList");
        nodeDataRepo.deleteAll();
        nodeDataRepo.save(nodeDataList);
        nodeDataRepo.flush();
        return nodeDataList;
    }

}
