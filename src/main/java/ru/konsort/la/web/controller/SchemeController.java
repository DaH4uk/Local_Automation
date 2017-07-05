package ru.konsort.la.web.controller;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.konsort.la.persist.entity.*;
import ru.konsort.la.persist.repo.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.io.File;
import java.nio.file.Files;
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

    @Autowired
    private SchemesRepo schemesRepo;

    @Autowired
    private ImageRepo imageRepo;


    @RequestMapping(value = "/scheme/links", method = RequestMethod.GET)
    public
    @ResponseBody
    List<LinkData> getLinkDataList() {
        return linkDataRepo.findAll();
    }

    @RequestMapping(value = "/scheme/nodes", method = RequestMethod.GET)
    public
    @ResponseBody
    List<NodeData> getNodeDataList() {
        return nodeDataRepo.findAll();
    }

    @RequestMapping(value = "/scheme/links", method = RequestMethod.POST)
    public
    @ResponseBody
    List<LinkData> saveLinkDataList(@RequestBody List<LinkData> linkDataList) {
        logger.debug("save linkDataList");
        linkDataRepo.deleteAll();
        linkDataRepo.save(linkDataList);
        linkDataRepo.flush();
        return linkDataList;
    }

    @RequestMapping(value = "/scheme/nodes", method = RequestMethod.POST)
    @ResponseBody
    public List<NodeData> saveNodeDataList(@RequestBody List<NodeData> nodeDataList, @RequestParam(value = "schemeId") Long schemeId) {
        List<NodeData> nodeData = nodeDataRepo.findBySchemeId(schemeId);
        for (NodeData oldNodes : nodeData) {
            nodeDataRepo.delete(oldNodes.getId());
        }

        for (NodeData newNodes : nodeDataList) {
            newNodes.setSchemeId(schemeId);
        }
        logger.debug("save nodeDataList");
        nodeDataRepo.save(nodeDataList);
        nodeDataRepo.flush();
        return nodeDataList;
    }

    @RequestMapping(value = "/scheme/upload", method = RequestMethod.POST)
    public void uploadImage(HttpServletRequest request,
                            @RequestParam(value = "file") MultipartFile file,
                            @RequestParam(value = "schemeId") Long schemeId) throws IOException {
        Image image = new Image();
        final String fileName = file.getOriginalFilename();
        image.setImageName(fileName);
        image.setImg(file.getBytes());
        image.setSchemeId(schemeId);
        Image tmpImg = imageRepo.findBySchemeId(schemeId);
        if (tmpImg != null) {
            imageRepo.delete(imageRepo.findBySchemeId(schemeId));
        }
        imageRepo.saveAndFlush(image);
    }

    @RequestMapping(value = "/scheme/getImgBySchemeId", method = RequestMethod.GET)
    public void getImgBySchemeId(@RequestParam(value = "schemeId") Long schemeId, HttpServletResponse response) throws IOException {
        Image image = imageRepo.findBySchemeId(schemeId);
        if (image != null) {
            OutputStream outputStream = response.getOutputStream();

            outputStream.write(image.getImg());
            outputStream.flush();
            outputStream.close();
        }

    }

    @RequestMapping(value = "/scheme/getImageIds", method = RequestMethod.GET)
    public List getFiles(HttpServletResponse response) throws IOException {
        return imageRepo.findAll();
    }

    @RequestMapping(value = "/scheme/getImageById", method = RequestMethod.GET)
    public void getImage(@RequestParam(value = "id") Long id, HttpServletResponse response) throws IOException {

        Image image = imageRepo.findById(id);
        OutputStream outputStream = response.getOutputStream();

        outputStream.write(image.getImg());
        outputStream.flush();
        outputStream.close();

    }


    @RequestMapping(value = "/scheme/getThumbnailImageById", method = RequestMethod.GET)
    public void getThumbnailImage(@RequestParam(value = "id") Long id, HttpServletResponse response) throws IOException {

        Image image = imageRepo.findById(id);

        File file = new File(image.getImageName());

        FileUtils.writeByteArrayToFile(file, image.getImg());
        Thumbnails.of(file).size(150, 150).outputFormat("jpg").toFile(file);

        OutputStream outputStream = response.getOutputStream();

        byte[] array = Files.readAllBytes(file.toPath());
        outputStream.write(array);
        outputStream.flush();
        outputStream.close();
    }

    @RequestMapping(value = "/scheme/create", method = RequestMethod.GET)
    public String createNewScheme(@RequestParam(value = "name") String schemeName) {
        Scheme scheme = new Scheme();
        scheme.setSchemeName(schemeName);
        schemesRepo.saveAndFlush(scheme);
        return "{\"schemeId\": " + scheme.getId() + "}";
    }

    @RequestMapping(value = "/scheme/getAll", method = RequestMethod.GET)
    public List<Scheme> getSchemeList() {
        return schemesRepo.findAll();
    }

    @RequestMapping(value = "/scheme/getNodesByScheme", method = RequestMethod.GET)
    public List<NodeData> getNodesByScheme(@RequestParam(value = "scheme_id") Long schemeId) {
        return nodeDataRepo.findBySchemeId(schemeId);
    }

}
