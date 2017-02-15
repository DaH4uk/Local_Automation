package ru.konsort.la.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.konsort.la.persist.entity.*;
import ru.konsort.la.persist.repo.FileRepo;
import ru.konsort.la.persist.repo.LinkDataRepo;
import ru.konsort.la.persist.repo.NodeDataRepo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.io.File;
import java.util.ArrayList;
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
    public void uploadImage(HttpServletRequest request, @RequestParam(value = "file") MultipartFile file) {
        System.out.println(request.getParameterMap());

        final String fileName = file.getOriginalFilename();

        InputStream inputStream = null;
        OutputStream outputStream = null;
        String IMAGE_RESOURCE_PATH = File.separator+ "resources"+File.separator+"uploaded_images";
        String directoryPath = request.getServletContext().getRealPath(IMAGE_RESOURCE_PATH + File.separator + fileName);
        File uploadedFile = new File(directoryPath);
        ru.konsort.la.persist.entity.File file1 = new ru.konsort.la.persist.entity.File();
        file1.setFileName(directoryPath);
        fileRepo.saveAndFlush(file1);
        try {
            outputStream = new FileOutputStream(uploadedFile);
            inputStream = file.getInputStream();
            write(inputStream, outputStream);
            inputStream.close();
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/scheme/files", method = RequestMethod.GET)
    public List<File> getFiles(HttpServletResponse response) throws IOException {
        List<File> files = new ArrayList<File>();
        for (ru.konsort.la.persist.entity.File filename : fileRepo.findAll()) {
            files.add(new File(filename.getFileName()));
        }
        return files;
    }

    private void write(InputStream in, OutputStream out) {
        byte[] buffer = new byte[1024];
        int len;
        try {
            while ((len = in.read(buffer)) >= 0)
                out.write(buffer, 0, len);
        } catch (IOException e) {
            e.getMessage();
        }
    }

}
