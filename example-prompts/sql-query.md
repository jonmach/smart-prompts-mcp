---
name: sql_query
title: SQL Query Builder
description: Build optimized SQL queries with best practices and performance considerations
category: database
tags: [sql, database, query, optimization, data]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: operation
    description: Type of operation (select, insert, update, delete, join)
    required: true
  - name: table
    description: Main table name
    required: true
  - name: database
    description: Database type (mysql, postgresql, sqlite, mssql)
    required: false
    default: postgresql
  - name: complexity
    description: Query complexity (simple, moderate, complex)
    required: false
    default: moderate
---

# SQL Query: {{operation}} on {{table}}

## Database: {{database}}

{{#if (eq operation "select")}}
### Basic SELECT Query

```sql
-- Simple select all
SELECT * FROM {{table}};

-- Select specific columns with aliases
SELECT 
    id,
    {{#if (eq database "postgresql")}}
    created_at::date AS created_date,
    {{else if (eq database "mysql")}}
    DATE(created_at) AS created_date,
    {{else if (eq database "mssql")}}
    CONVERT(date, created_at) AS created_date,
    {{else}}
    date(created_at) AS created_date,
    {{/if}}
    name,
    status
FROM {{table}}
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 100;
```

{{#if (or (eq complexity "moderate") (eq complexity "complex"))}}
### Advanced SELECT with Filtering

```sql
-- With multiple conditions and pattern matching
SELECT 
    t.*,
    COUNT(*) OVER() AS total_count  -- Window function for pagination
FROM {{table}} t
WHERE 1=1
    AND t.status IN ('active', 'pending')
    AND t.created_at >= {{#if (eq database "postgresql")}}CURRENT_DATE - INTERVAL '30 days'{{else if (eq database "mysql")}}DATE_SUB(CURDATE(), INTERVAL 30 DAY){{else if (eq database "mssql")}}DATEADD(day, -30, GETDATE()){{else}}date('now', '-30 days'){{/if}}
    AND (
        t.name {{#if (eq database "postgresql")}}ILIKE{{else}}LIKE{{/if}} '%search_term%'
        OR t.description {{#if (eq database "postgresql")}}ILIKE{{else}}LIKE{{/if}} '%search_term%'
    )
ORDER BY 
    t.priority DESC,
    t.created_at DESC
{{#if (eq database "postgresql")}}
LIMIT 20 OFFSET 0;
{{else if (eq database "mysql")}}
LIMIT 0, 20;
{{else if (eq database "mssql")}}
OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY;
{{else}}
LIMIT 20 OFFSET 0;
{{/if}}
```
{{/if}}

{{#if (eq complexity "complex")}}
### Complex SELECT with Aggregations

```sql
-- Aggregated data with grouping
WITH monthly_stats AS (
    SELECT 
        {{#if (eq database "postgresql")}}
        DATE_TRUNC('month', created_at) AS month,
        {{else if (eq database "mysql")}}
        DATE_FORMAT(created_at, '%Y-%m-01') AS month,
        {{else if (eq database "mssql")}}
        DATEADD(month, DATEDIFF(month, 0, created_at), 0) AS month,
        {{else}}
        strftime('%Y-%m-01', created_at) AS month,
        {{/if}}
        status,
        COUNT(*) AS count,
        SUM(amount) AS total_amount,
        AVG(amount) AS avg_amount,
        MAX(amount) AS max_amount
    FROM {{table}}
    WHERE created_at >= {{#if (eq database "postgresql")}}CURRENT_DATE - INTERVAL '1 year'{{else if (eq database "mysql")}}DATE_SUB(CURDATE(), INTERVAL 1 YEAR){{else if (eq database "mssql")}}DATEADD(year, -1, GETDATE()){{else}}date('now', '-1 year'){{/if}}
    GROUP BY 
        {{#if (eq database "postgresql")}}DATE_TRUNC('month', created_at){{else if (eq database "mysql")}}DATE_FORMAT(created_at, '%Y-%m-01'){{else if (eq database "mssql")}}DATEADD(month, DATEDIFF(month, 0, created_at), 0){{else}}strftime('%Y-%m-01', created_at){{/if}},
        status
)
SELECT 
    month,
    status,
    count,
    total_amount,
    avg_amount,
    max_amount,
    {{#if (eq database "postgresql")}}
    LAG(total_amount) OVER (PARTITION BY status ORDER BY month) AS prev_month_amount,
    total_amount - LAG(total_amount) OVER (PARTITION BY status ORDER BY month) AS month_over_month_change
    {{else}}
    0 AS prev_month_amount,
    0 AS month_over_month_change
    {{/if}}
FROM monthly_stats
ORDER BY month DESC, status;
```
{{/if}}
{{/if}}

{{#if (eq operation "insert")}}
### INSERT Operations

```sql
-- Single row insert
INSERT INTO {{table}} (name, description, status, created_at)
VALUES ('Example Name', 'Example Description', 'active', {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}});

-- Multiple row insert
INSERT INTO {{table}} (name, description, status, created_at)
VALUES 
    ('Name 1', 'Description 1', 'active', {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}}),
    ('Name 2', 'Description 2', 'pending', {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}}),
    ('Name 3', 'Description 3', 'active', {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}});

{{#if (eq database "postgresql")}}
-- Insert with RETURNING clause
INSERT INTO {{table}} (name, description, status)
VALUES ('New Item', 'New Description', 'active')
RETURNING id, created_at;

-- Insert with conflict handling
INSERT INTO {{table}} (external_id, name, description, status)
VALUES ('EXT123', 'Item Name', 'Description', 'active')
ON CONFLICT (external_id) 
DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();
{{else if (eq database "mysql")}}
-- Insert with duplicate key handling
INSERT INTO {{table}} (external_id, name, description, status)
VALUES ('EXT123', 'Item Name', 'Description', 'active')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    updated_at = NOW();
{{/if}}
```
{{/if}}

{{#if (eq operation "update")}}
### UPDATE Operations

```sql
-- Simple update
UPDATE {{table}}
SET 
    status = 'inactive',
    updated_at = {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}}
WHERE id = 123;

-- Conditional update with multiple fields
UPDATE {{table}}
SET 
    name = 'Updated Name',
    description = 'Updated Description',
    status = CASE 
        WHEN status = 'pending' THEN 'active'
        WHEN status = 'active' THEN 'completed'
        ELSE status
    END,
    updated_at = {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}}
WHERE 
    status IN ('pending', 'active')
    AND created_at < {{#if (eq database "postgresql")}}CURRENT_DATE - INTERVAL '7 days'{{else if (eq database "mysql")}}DATE_SUB(CURDATE(), INTERVAL 7 DAY){{else if (eq database "mssql")}}DATEADD(day, -7, GETDATE()){{else}}date('now', '-7 days'){{/if}};

{{#if (or (eq database "postgresql") (eq database "mysql"))}}
-- Update with join
UPDATE {{table}} t
{{#if (eq database "postgresql")}}
SET status = 'archived'
FROM related_table r
WHERE t.related_id = r.id
    AND r.status = 'deleted';
{{else}}
INNER JOIN related_table r ON t.related_id = r.id
SET t.status = 'archived'
WHERE r.status = 'deleted';
{{/if}}
{{/if}}
```
{{/if}}

{{#if (eq operation "delete")}}
### DELETE Operations

```sql
-- Safe delete with WHERE clause
DELETE FROM {{table}}
WHERE id = 123;

-- Bulk delete with conditions
DELETE FROM {{table}}
WHERE 
    status = 'deleted'
    AND updated_at < {{#if (eq database "postgresql")}}CURRENT_DATE - INTERVAL '90 days'{{else if (eq database "mysql")}}DATE_SUB(CURDATE(), INTERVAL 90 DAY){{else if (eq database "mssql")}}DATEADD(day, -90, GETDATE()){{else}}date('now', '-90 days'){{/if}};

{{#if (eq database "postgresql")}}
-- Delete with RETURNING
DELETE FROM {{table}}
WHERE status = 'expired'
RETURNING id, name;
{{/if}}

-- Soft delete pattern (recommended)
UPDATE {{table}}
SET 
    deleted_at = {{#if (eq database "postgresql")}}NOW(){{else if (eq database "mysql")}}NOW(){{else if (eq database "mssql")}}GETDATE(){{else}}datetime('now'){{/if}},
    status = 'deleted'
WHERE id IN (1, 2, 3);
```
{{/if}}

{{#if (eq operation "join")}}
### JOIN Operations

```sql
-- Inner join
SELECT 
    t1.*,
    t2.name AS related_name,
    t2.status AS related_status
FROM {{table}} t1
INNER JOIN related_table t2 ON t1.related_id = t2.id
WHERE t1.status = 'active';

-- Left join with aggregation
SELECT 
    t1.id,
    t1.name,
    COUNT(t2.id) AS related_count,
    {{#if (eq database "postgresql")}}
    COALESCE(SUM(t2.amount), 0) AS total_amount
    {{else}}
    IFNULL(SUM(t2.amount), 0) AS total_amount
    {{/if}}
FROM {{table}} t1
LEFT JOIN transactions t2 ON t1.id = t2.{{table}}_id
    AND t2.status = 'completed'
GROUP BY t1.id, t1.name
HAVING COUNT(t2.id) > 0
ORDER BY total_amount DESC;

{{#if (or (eq complexity "moderate") (eq complexity "complex"))}}
-- Complex join with multiple tables
SELECT 
    t1.*,
    u.name AS user_name,
    c.name AS category_name,
    {{#if (eq database "postgresql")}}
    ARRAY_AGG(DISTINCT tag.name) AS tags
    {{else if (eq database "mysql")}}
    GROUP_CONCAT(DISTINCT tag.name) AS tags
    {{else if (eq database "mssql")}}
    STRING_AGG(tag.name, ',') AS tags
    {{else}}
    GROUP_CONCAT(DISTINCT tag.name) AS tags
    {{/if}}
FROM {{table}} t1
INNER JOIN users u ON t1.user_id = u.id
LEFT JOIN categories c ON t1.category_id = c.id
LEFT JOIN {{table}}_tags tt ON t1.id = tt.{{table}}_id
LEFT JOIN tags tag ON tt.tag_id = tag.id
WHERE t1.status = 'published'
GROUP BY t1.id, u.name, c.name
ORDER BY t1.created_at DESC;
{{/if}}
{{/if}}

## Performance Optimization Tips

### Indexing Strategy
```sql
-- Create indexes for common queries
CREATE INDEX idx_{{table}}_status ON {{table}}(status);
CREATE INDEX idx_{{table}}_created_at ON {{table}}(created_at DESC);
CREATE INDEX idx_{{table}}_status_created ON {{table}}(status, created_at DESC);

{{#if (eq database "postgresql")}}
-- Partial index for specific conditions
CREATE INDEX idx_{{table}}_active ON {{table}}(created_at DESC) 
WHERE status = 'active';

-- GIN index for text search
CREATE INDEX idx_{{table}}_search ON {{table}} USING gin(to_tsvector('english', name || ' ' || description));
{{/if}}
```

### Query Analysis
```sql
{{#if (eq database "postgresql")}}
-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM {{table}} WHERE status = 'active';
{{else if (eq database "mysql")}}
-- Analyze query performance
EXPLAIN SELECT * FROM {{table}} WHERE status = 'active';
{{else if (eq database "mssql")}}
-- Show execution plan
SET SHOWPLAN_TEXT ON;
SELECT * FROM {{table}} WHERE status = 'active';
SET SHOWPLAN_TEXT OFF;
{{/if}}
```

## Best Practices Checklist

- [ ] Always use parameterized queries to prevent SQL injection
- [ ] Include WHERE clause in UPDATE and DELETE statements
- [ ] Use appropriate indexes for frequent queries
- [ ] Avoid SELECT * in production code
- [ ] Use transactions for multiple related operations
- [ ] Consider using soft deletes instead of hard deletes
- [ ] Test queries with EXPLAIN/ANALYZE before deployment
- [ ] Use appropriate data types for columns
- [ ] Implement proper error handling
- [ ] Consider query result caching for expensive operations