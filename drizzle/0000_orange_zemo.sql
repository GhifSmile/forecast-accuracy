CREATE TABLE "data_collection_forecast_accuracy" (
	"year" integer,
	"month" integer,
	"week" integer,
	"plant" varchar(50),
	"business_unit" varchar(50),
	"category" varchar(50),
	"code" varchar(50),
	"forecast" numeric,
	"produksi" numeric,
	"sales" numeric,
	"created_at" timestamp,
	"upload_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'officer',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE VIEW "public"."plant_performance_detail_monthly" AS (WITH

Code_Summary AS (
    SELECT
        t1.year,
        t1.month,
        t1.plant,
        t1.business_unit,
        t1.code,
        SUM(t1.forecast) AS sum_f,
        SUM(t1.sales) AS sum_s
    FROM
        data_collection_forecast_accuracy t1
    GROUP BY
        t1.year, t1.month, t1.plant, t1.business_unit, t1.code
),

Code_Error_Monthly AS (
    SELECT
        t2.*,
        case
	        WHEN t2.sum_f = 0 AND t2.sum_s = 0 then null
            WHEN t2.sum_f = 0 OR t2.sum_s = 0 THEN 1.0
            WHEN ABS(t2.sum_f - t2.sum_s) / NULLIF(t2.sum_f, 0) > 1 THEN 1.0
            ELSE ABS(t2.sum_f - t2.sum_s) / NULLIF(t2.sum_f, 0)
        END AS valid_error_value
    FROM
        Code_Summary t2
),

BU_Monthly_Avg_Error AS (
    SELECT
        t3.year,
        t3.month,
        t3.plant,
        t3.business_unit,
        
        COALESCE(
            SUM(t3.valid_error_value) / NULLIF(COUNT(CASE WHEN t3.valid_error_value > 0 THEN 1 END), 0)
        , 0) AS average_error_rate_monthly,
        
        SUM(t3.sum_f) AS total_monthly_f,
        SUM(t3.sum_s) AS total_monthly_s

    FROM
        Code_Error_Monthly t3
    GROUP BY
        t3.year, t3.month, t3.plant, t3.business_unit
),

Max_Month AS (
    SELECT
        year,
        plant,
        business_unit,
        MAX(month) AS bulan_akhir
    FROM
        Code_Summary
    GROUP BY
        year, plant, business_unit
),

Code_Accuracy_YTD AS (
    SELECT
        cs.year,
        cs.plant,
        cs.business_unit,
        cs.code,
        
        SUM(cs.sum_f) AS sum_f_ytd,
        SUM(cs.sum_s) AS sum_s_ytd
        
    FROM
        Code_Summary cs
    INNER JOIN 
        Max_Month mm ON cs.year = mm.year AND cs.plant = mm.plant AND cs.business_unit = mm.business_unit
    WHERE
        cs.month <= mm.bulan_akhir
    GROUP BY 
        cs.year, cs.plant, cs.business_unit, cs.code
),

BU_Avg_Error_YTD AS (
    SELECT
        t6.year,
        t6.plant,
        t6.business_unit,
        
        case
	        WHEN t6.sum_f_ytd = 0 and t6.sum_s_ytd = 0 THEN null
            WHEN t6.sum_f_ytd = 0 OR t6.sum_s_ytd = 0 THEN 1.0
            WHEN ABS(t6.sum_f_ytd - t6.sum_s_ytd) / NULLIF(t6.sum_f_ytd, 0) > 1 THEN 1.0
            ELSE ABS(t6.sum_f_ytd - t6.sum_s_ytd) / NULLIF(t6.sum_f_ytd, 0)
        END AS valid_error_value_ytd,
        
        1 AS group_key 
    FROM
        Code_Accuracy_YTD t6
),

Final_YTD_Error AS (
    SELECT
        year,
        plant,
        business_unit,
        COALESCE(
            SUM(valid_error_value_ytd) / NULLIF(COUNT(CASE WHEN valid_error_value_ytd > 0 THEN 1 END), 0)
        , 0) AS average_error_rate_ytd
    FROM
        BU_Avg_Error_YTD
    GROUP BY
        year, plant, business_unit
),

Final_Report AS (
    SELECT
        t7.plant,
        t7.business_unit,
        t7.year,
        
        SUM(CASE WHEN t7.month = 1 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Jan,
        SUM(CASE WHEN t7.month = 2 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Feb,
        SUM(CASE WHEN t7.month = 3 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Mar,
        SUM(CASE WHEN t7.month = 4 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Apr,
        SUM(CASE WHEN t7.month = 5 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS May,
        SUM(CASE WHEN t7.month = 6 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Jun,
        SUM(CASE WHEN t7.month = 7 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Jul,
        SUM(CASE WHEN t7.month = 8 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Aug,
        SUM(CASE WHEN t7.month = 9 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Sep,
        SUM(CASE WHEN t7.month = 10 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Oct,
        SUM(CASE WHEN t7.month = 11 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Nov,
        SUM(CASE WHEN t7.month = 12 THEN ROUND(1.0 - t7.average_error_rate_monthly, 4) ELSE NULL END) AS Dec
        
    FROM
        BU_Monthly_Avg_Error t7
    GROUP BY
        t7.plant, t7.business_unit, t7.year
)

SELECT
    t8.*,
    
    ROUND(1.0 - t9.average_error_rate_ytd, 4) AS YTD_Avg,
    
    CASE
        WHEN t9.average_error_rate_ytd = 0 THEN NULL
        ELSE 
            ROUND(
                (1.0 - t9.average_error_rate_ytd) -
                CASE 
					WHEN t8.year >= 2026 THEN 0.80
                    WHEN t9.business_unit = 'fish' THEN 0.78 
                    ELSE 0.70
                END,
            4)
    END AS Vs_Target
    
FROM
    Final_Report t8
INNER JOIN 
    Final_YTD_Error t9 ON t8.year = t9.year AND t8.plant = t9.plant AND t8.business_unit = t9.business_unit
ORDER BY
    t8.year, t8.plant, t8.business_unit);--> statement-breakpoint
CREATE VIEW "public"."trend_analysis_monthly" AS (WITH

Code_Monthly_Agg AS (
    SELECT
        year,
        month,
        business_unit,
        code,
        SUM(forecast) as sum_f,
        SUM(sales) as sum_s
    FROM
        data_collection_forecast_accuracy
    GROUP BY
        year, month, business_unit, code
),

Code_Error_Rates AS (
    SELECT
        *,
        CAST(
            case
	            when sum_f = 0 and sum_s = 0 then null
                WHEN sum_f = 0 OR sum_s = 0 THEN 1.0
                WHEN ABS(sum_f - sum_s) / NULLIF(sum_f, 0) > 1.0 THEN 1.0
                ELSE ABS(sum_f - sum_s) / NULLIF(sum_f, 0)
            END AS DOUBLE PRECISION
        ) AS error_val
    FROM
        Code_Monthly_Agg
),

Monthly_Metrics AS (
    SELECT
        year,
        month,
        COALESCE(1.0 - (AVG(error_val) FILTER (WHERE error_val > 0)), 1.0) as overall_accuracy,
        COALESCE(1.0 - (AVG(error_val) FILTER (WHERE error_val > 0 AND business_unit = 'fish')), 1.0) as fish_accuracy,
        COALESCE(1.0 - (AVG(error_val) FILTER (WHERE error_val > 0 AND business_unit = 'shrimp')), 1.0) as shrimp_accuracy
    FROM
        Code_Error_Rates
    GROUP BY
        year, month
),

Plant_Rankings AS (
    SELECT
        year,
        month,
        CONCAT(plant, ' - ', INITCAP(business_unit)) as plant_bu,
        COALESCE(1.0 - (AVG(error_val) FILTER (WHERE error_val > 0)), 1.0) as plant_acc
    FROM (
        SELECT 
            year, month, plant, business_unit, code,
            CAST(case
	            when SUM(forecast) = 0 and SUM(sales) = 0 THEN null
                WHEN SUM(forecast) = 0 OR SUM(sales) = 0 THEN 1.0
                WHEN ABS(SUM(forecast) - SUM(sales)) / NULLIF(SUM(forecast), 0) > 1.0 THEN 1.0
                ELSE ABS(SUM(forecast) - SUM(sales)) / NULLIF(SUM(forecast), 0)
            END AS DOUBLE PRECISION) as error_val
        FROM data_collection_forecast_accuracy
        GROUP BY year, month, plant, business_unit, code
    ) t
    GROUP BY year, month, plant, business_unit
),

Ranked AS (
    SELECT 
        *,
        RANK() OVER (PARTITION BY year, month ORDER BY plant_acc DESC) as r_best,
        RANK() OVER (PARTITION BY year, month ORDER BY plant_acc ASC) as r_worst
    FROM Plant_Rankings
)

SELECT
    m.year,
    m.month,
    ROUND(CAST(m.overall_accuracy AS NUMERIC), 4) as overall_accuracy,
    ROUND(CAST(m.fish_accuracy AS NUMERIC), 4) as fish_accuracy,
    ROUND(CAST(m.shrimp_accuracy AS NUMERIC), 4) as shrimp_accuracy,
    (SELECT STRING_AGG(plant_bu, ', ') FROM Ranked r WHERE r.year = m.year AND r.month = m.month AND r.r_best = 1) as best_performing,
    (SELECT STRING_AGG(plant_bu, ', ') FROM Ranked r WHERE r.year = m.year AND r.month = m.month AND r.r_worst = 1) as worst_performing
FROM
    Monthly_Metrics m
ORDER BY
    m.year, m.month);