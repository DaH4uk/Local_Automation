package ru.konsort.la.web.controller;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.konsort.la.persist.entity.*;
import ru.konsort.la.persist.repo.FileRepo;
import ru.konsort.la.persist.repo.ImageRepo;
import ru.konsort.la.persist.repo.LinkDataRepo;
import ru.konsort.la.persist.repo.NodeDataRepo;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
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
    private FileRepo fileRepo;

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
    public
    @ResponseBody
    List<NodeData> saveNodeDataList(@RequestBody List<NodeData> nodeDataList) {
        logger.debug("save nodeDataList");
        nodeDataRepo.deleteAll();
        nodeDataRepo.save(nodeDataList);
        nodeDataRepo.flush();
        return nodeDataList;
    }

    @RequestMapping(value = "/scheme/upload", method = RequestMethod.POST)
    public void uploadImage(HttpServletRequest request, @RequestParam(value = "file") MultipartFile file) throws IOException {
        Image image = new Image();
        final String fileName = file.getOriginalFilename();

        image.setImageName(fileName);

        image.setImg(file.getBytes());

        imageRepo.saveAndFlush(image);

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

    private File convert(MultipartFile file) {
        File convFile = new File(file.getOriginalFilename());

        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            Boolean aBoolean = convFile.createNewFile();
            fos.write(file.getBytes());

        } catch (IOException e) {
            e.printStackTrace();
        }

        return convFile;
    }


}
