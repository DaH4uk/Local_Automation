package ru.konsort.la.persist.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * Created by Turov Danil on 14.12.2016.
 */
@Entity
@Table(name = "NODE_DATA")
public class NodeData {

    @Id
    @GenericGenerator(name = "generator", strategy = "increment")
    @GeneratedValue(generator = "generator")
    @Column(name = "id", nullable = false)
    @JsonIgnore
    private Long id;

    @Column(name = "key", nullable = false)
    private String key;

    @Column(name = "category")
    private String category;

    @Column(name = "pos")
    private String pos;

    @Column(name = "text")
    private String text;

    @Column(name = "angle")
    private Integer angle;

    @JsonIgnore
    @Column(name = "scheme_id")
    private Long schemeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPos() {
        return pos;
    }

    public void setPos(String pos) {
        this.pos = pos;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getAngle() {
        return angle;
    }

    public void setAngle(Integer angle) {
        this.angle = angle;
    }

    public Long getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(Long schemeId) {
        this.schemeId = schemeId;
    }
}
