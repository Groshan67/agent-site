---
title: "Code Generation with Database Schema — generate SQL queries from schema context"
tags:
  - code-generation
  - sql
  - database
  - few-shot
  - prompting-guide
date: "2026-08-23"
author: "dair-ai"
sourceUrl: "https://www.promptingguide.ai/introduction/examples"
---

"""
Table departments, columns = [DepartmentId, DepartmentName]
Table students, columns = [DepartmentId, StudentId, StudentName]
Create a MySQL query for all students in the Computer Science Department
"""

Output:
SELECT StudentId, StudentName 
FROM students 
WHERE DepartmentId IN (SELECT DepartmentId FROM departments WHERE DepartmentName = 'Computer Science');