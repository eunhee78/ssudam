package com.ssdam.todolist.entity;

import com.ssdam.audit.Auditable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Setter
@Getter
@Entity
public class TodoList extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long todolist_id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer todo_order;

    public void setTodo_order(Integer todo_order) {
        this.todo_order = todo_order;
    }
}
