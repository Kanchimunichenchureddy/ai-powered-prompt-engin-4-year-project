// Enhanced Data Analysis Mode Implementation for PromptEngine
// Structure: 1. Dataset Description, 2. Columns Summary, 3. Objective, 4. Assumptions, 5. Analysis Tasks, 6. Modeling Steps, 7. Output Format

class DataAnalysisModeHandler {
    constructor() {
        this.dataAnalysisConfig = {
            datasetTypes: this.defineDatasetTypes(),
            analysisObjectives: this.defineAnalysisObjectives(),
            assumptions: this.defineCommonAssumptions(),
            analysisTasks: this.defineAnalysisTasks(),
            modelingSteps: this.defineModelingSteps(),
            outputFormats: this.defineOutputFormats()
        };
    }

    // 1. DATASET DESCRIPTION TYPES
    defineDatasetTypes() {
        return {
            transactional: {
                description: "Transaction-level data with timestamps and amounts",
                characteristics: ["temporal", "numerical", "categorical"],
                typical_size: "Large (millions of records)",
                common_fields: ["transaction_id", "timestamp", "amount", "user_id", "category"],
                data_quality_concerns: ["duplicates", "missing timestamps", "outlier amounts"],
                preprocessing_needs: ["date parsing", "amount validation", "duplicate removal"]
            },
            customer: {
                description: "Customer demographic and behavioral data",
                characteristics: ["demographic", "behavioral", "segmentation-ready"],
                typical_size: "Medium (thousands to hundreds of thousands)",
                common_fields: ["customer_id", "age", "gender", "location", "purchase_history"],
                data_quality_concerns: ["missing demographics", "inconsistent formats", "privacy compliance"],
                preprocessing_needs: ["standardization", "encoding", "feature engineering"]
            },
            time_series: {
                description: "Time-ordered data points for trend analysis",
                characteristics: ["temporal", "sequential", "trend-focused"],
                typical_size: "Variable (depends on frequency)",
                common_fields: ["timestamp", "value", "metric", "location", "category"],
                data_quality_concerns: ["irregular intervals", "missing data points", "seasonality"],
                preprocessing_needs: ["resampling", "interpolation", "trend decomposition"]
            },
            survey: {
                description: "Survey responses and feedback data",
                characteristics: ["categorical", "ordinal", "subjective"],
                typical_size: "Small to medium (hundreds to thousands)",
                common_fields: ["response_id", "question_id", "answer", "respondent_demographics"],
                data_quality_concerns: ["response bias", "incomplete responses", "scale consistency"],
                preprocessing_needs: ["response cleaning", "scale normalization", "sentiment analysis"]
            },
            operational: {
                description: "Business operations and performance metrics",
                characteristics: ["KPI-focused", "performance", "operational"],
                typical_size: "Medium (thousands of records)",
                common_fields: ["date", "department", "metric_name", "value", "target"],
                data_quality_concerns: ["metric definitions", "data freshness", "accuracy"],
                preprocessing_needs: ["metric standardization", "target alignment", "performance calculations"]
            }
        };
    }

    // 2. COLUMNS SUMMARY FRAMEWORK
    defineColumnTypes() {
        return {
            numerical_continuous: {
                description: "Continuous numerical values",
                analysis_methods: ["descriptive statistics", "distribution analysis", "correlation"],
                visualization: ["histograms", "box plots", "scatter plots"],
                preprocessing: ["outlier detection", "normalization", "transformation"]
            },
            numerical_discrete: {
                description: "Discrete numerical values (counts, IDs)",
                analysis_methods: ["frequency analysis", "count statistics"],
                visualization: ["bar charts", "count plots"],
                preprocessing: ["range validation", "duplicate checking"]
            },
            categorical_nominal: {
                description: "Categories without inherent order",
                analysis_methods: ["frequency distribution", "chi-square tests"],
                visualization: ["pie charts", "bar charts", "stacked plots"],
                preprocessing: ["encoding", "rare category handling", "standardization"]
            },
            categorical_ordinal: {
                description: "Categories with natural ordering",
                analysis_methods: ["rank correlation", "ordered logistic regression"],
                visualization: ["ordered bar charts", "stacked plots"],
                preprocessing: ["ordinal encoding", "rank assignment"]
            },
            temporal: {
                description: "Date and time information",
                analysis_methods: ["time series analysis", "seasonality detection"],
                visualization: ["time series plots", "seasonal decomposition"],
                preprocessing: ["date parsing", "timezone handling", "feature extraction"]
            },
            text: {
                description: "Textual data for NLP analysis",
                analysis_methods: ["sentiment analysis", "topic modeling", "text mining"],
                visualization: ["word clouds", "topic clusters", "sentiment trends"],
                preprocessing: ["tokenization", "lemmatization", "vectorization"]
            }
        };
    }

    // 3. ANALYSIS OBJECTIVES
    defineAnalysisObjectives() {
        return {
            descriptive: {
                purpose: "Understand what happened in the data",
                key_questions: [
                    "What are the main characteristics of the dataset?",
                    "What patterns and trends exist in the data?",
                    "What is the distribution of key variables?",
                    "Are there any notable outliers or anomalies?"
                ],
                deliverables: ["summary statistics", "data profiling report", "exploratory visualizations"],
                success_metrics: ["data quality score", "coverage percentage", "insight generation"]
            },
            diagnostic: {
                purpose: "Understand why something happened",
                key_questions: [
                    "What factors contributed to observed patterns?",
                    "What are the relationships between variables?",
                    "What caused specific trends or changes?",
                    "Are there hidden correlations or dependencies?"
                ],
                deliverables: ["correlation analysis", "causal inference", "root cause analysis"],
                success_metrics: ["correlation strength", "explanatory power", "insight actionability"]
            },
            predictive: {
                purpose: "Forecast what might happen in the future",
                key_questions: [
                    "What will happen next based on current trends?",
                    "Which customers are likely to churn?",
                    "What will sales be like next quarter?",
                    "Which products will be in demand?"
                ],
                deliverables: ["predictive models", "forecasts", "probability estimates"],
                success_metrics: ["model accuracy", "prediction confidence", "business impact"]
            },
            prescriptive: {
                purpose: "Recommend what actions to take",
                key_questions: [
                    "What should we do to optimize outcomes?",
                    "Which strategy will yield the best results?",
                    "How should we allocate resources?",
                    "What interventions will be most effective?"
                ],
                deliverables: ["optimization recommendations", "scenario analysis", "decision frameworks"],
                success_metrics: ["ROI improvement", "decision confidence", "implementation feasibility"]
            },
            comparative: {
                purpose: "Compare different groups, time periods, or scenarios",
                key_questions: [
                    "How do different segments perform compared to each other?",
                    "What changes occurred between time periods?",
                    "Which approach works better?",
                    "Are there significant differences between groups?"
                ],
                deliverables: ["comparative analysis", "A/B testing results", "benchmark studies"],
                success_metrics: ["statistical significance", "effect size", "practical significance"]
            }
        };
    }

    // 4. COMMON ASSUMPTIONS
    defineCommonAssumptions() {
        return {
            data_quality: {
                assumptions: [
                    "Data is representative of the population of interest",
                    "Missing data is missing at random (MAR) or can be imputed appropriately",
                    "Outliers are either valid extreme values or identifiable errors",
                    "Data collection methodology is consistent across time periods",
                    "Data sources are reliable and accurate"
                ],
                validation_methods: [
                    "Sample representativeness testing",
                    "Missing data pattern analysis",
                    "Outlier detection and investigation",
                    "Data lineage verification",
                    "Cross-source validation"
                ]
            },
            statistical: {
                assumptions: [
                    "Independence of observations (no autocorrelation)",
                    "Normal distribution of residuals (for parametric tests)",
                    "Homoscedasticity (constant variance)",
                    "Linear relationships between variables (when assumed)",
                    "No multicollinearity among predictors"
                ],
                validation_methods: [
                    "Durbin-Watson test for autocorrelation",
                    "Shapiro-Wilk test for normality",
                    "Breusch-Pagan test for homoscedasticity",
                    "Scatter plot analysis for linearity",
                    "Variance Inflation Factor (VIF) for multicollinearity"
                ]
            },
            business: {
                assumptions: [
                    "Business context and domain knowledge are accurately captured",
                    "Stakeholder requirements are clearly defined and stable",
                    "External factors (market conditions, regulations) remain relatively stable",
                    "Historical patterns will continue into the future (for predictive analysis)",
                    "Data definitions align with business definitions"
                ],
                validation_methods: [
                    "Stakeholder interviews and validation",
                    "Business rule verification",
                    "External environment scanning",
                    "Trend stability analysis",
                    "Data dictionary cross-reference"
                ]
            },
            methodological: {
                assumptions: [
                    "Chosen analytical methods are appropriate for the data type and objective",
                    "Sample size is sufficient for robust statistical inference",
                    "Model complexity is appropriate (not overfitted or underfitted)",
                    "Cross-validation approach provides reliable performance estimates",
                    "Feature engineering captures relevant information"
                ],
                validation_methods: [
                    "Method appropriateness review",
                    "Power analysis for sample size",
                    "Learning curve analysis",
                    "Cross-validation stability testing",
                    "Feature importance analysis"
                ]
            }
        };
    }

    // 5. ANALYSIS TASKS FRAMEWORK
    defineAnalysisTasks() {
        return {
            data_exploration: {
                tasks: [
                    "Initial data profiling and quality assessment",
                    "Univariate analysis of all variables",
                    "Bivariate analysis of key relationships",
                    "Missing data pattern analysis",
                    "Outlier detection and investigation",
                    "Data distribution analysis",
                    "Temporal pattern identification",
                    "Correlation matrix generation"
                ],
                deliverables: ["EDA report", "data quality dashboard", "correlation heatmap"],
                tools: ["pandas profiling", "matplotlib/seaborn", "plotly", "statistical tests"]
            },
            feature_engineering: {
                tasks: [
                    "Feature selection based on relevance and importance",
                    "New feature creation from existing variables",
                    "Categorical variable encoding (one-hot, target, etc.)",
                    "Numerical variable transformation (log, polynomial, etc.)",
                    "Temporal feature extraction (seasonality, trends)",
                    "Interaction feature creation",
                    "Dimensionality reduction if needed",
                    "Feature scaling and normalization"
                ],
                deliverables: ["feature engineering pipeline", "feature importance ranking"],
                tools: ["scikit-learn", "feature-engine", "category_encoders"]
            },
            statistical_analysis: {
                tasks: [
                    "Hypothesis testing for key business questions",
                    "Confidence interval estimation",
                    "Statistical significance testing",
                    "Effect size calculation",
                    "Regression analysis (linear/logistic)",
                    "ANOVA for group comparisons",
                    "Chi-square tests for categorical associations",
                    "Time series decomposition"
                ],
                deliverables: ["statistical test results", "regression models", "significance reports"],
                tools: ["scipy.stats", "statsmodels", "pingouin"]
            },
            predictive_modeling: {
                tasks: [
                    "Model selection and algorithm comparison",
                    "Training and validation set creation",
                    "Hyperparameter tuning",
                    "Cross-validation implementation",
                    "Model performance evaluation",
                    "Feature importance analysis",
                    "Model interpretation and explainability",
                    "Prediction generation and confidence intervals"
                ],
                deliverables: ["trained models", "performance metrics", "prediction results"],
                tools: ["scikit-learn", "xgboost", "lightgbm", "optuna"]
            },
            visualization: {
                tasks: [
                    "Exploratory data visualization creation",
                    "Statistical chart generation",
                    "Interactive dashboard development",
                    "Model performance visualization",
                    "Trend and pattern visualization",
                    "Comparative analysis charts",
                    "Presentation-ready graphics",
                    "Executive summary visualizations"
                ],
                deliverables: ["visualization suite", "interactive dashboards", "executive charts"],
                tools: ["matplotlib", "seaborn", "plotly", "tableau", "power bi"]
            }
        };
    }

    // 6. MODELING STEPS FRAMEWORK
    defineModelingSteps() {
        return {
            data_preparation: {
                step_number: 1,
                description: "Prepare data for modeling",
                activities: [
                    "Data cleaning and quality checks",
                    "Missing value imputation strategy",
                    "Outlier treatment decision",
                    "Train/validation/test split",
                    "Feature scaling and encoding",
                    "Data leakage prevention",
                    "Baseline model establishment"
                ],
                outputs: ["cleaned dataset", "preprocessing pipeline", "baseline metrics"],
                validation: ["data quality report", "preprocessing validation", "baseline performance"]
            },
            model_selection: {
                step_number: 2,
                description: "Select appropriate modeling approach",
                activities: [
                    "Problem type identification (classification/regression/clustering)",
                    "Algorithm family selection based on data characteristics",
                    "Model complexity consideration",
                    "Interpretability vs performance trade-off",
                    "Computational resource assessment",
                    "Business constraint incorporation",
                    "Initial model prototyping"
                ],
                outputs: ["model selection rationale", "candidate algorithms", "prototype results"],
                validation: ["algorithm appropriateness", "resource feasibility", "initial performance"]
            },
            model_training: {
                step_number: 3,
                description: "Train and optimize models",
                activities: [
                    "Hyperparameter space definition",
                    "Cross-validation strategy implementation",
                    "Grid search or Bayesian optimization",
                    "Model training with best parameters",
                    "Ensemble method consideration",
                    "Overfitting prevention measures",
                    "Training convergence monitoring"
                ],
                outputs: ["optimized models", "hyperparameter configurations", "training logs"],
                validation: ["convergence verification", "overfitting checks", "parameter stability"]
            },
            model_evaluation: {
                step_number: 4,
                description: "Comprehensive model assessment",
                activities: [
                    "Performance metric calculation",
                    "Cross-validation score analysis",
                    "Learning curve examination",
                    "Feature importance analysis",
                    "Model bias and fairness assessment",
                    "Prediction interval estimation",
                    "Business metric translation"
                ],
                outputs: ["performance report", "evaluation metrics", "bias assessment"],
                validation: ["metric reliability", "statistical significance", "business relevance"]
            },
            model_interpretation: {
                step_number: 5,
                description: "Explain model decisions and insights",
                activities: [
                    "Global feature importance calculation",
                    "Local explanation generation (SHAP/LIME)",
                    "Partial dependence plot creation",
                    "Decision boundary visualization",
                    "Model behavior analysis",
                    "Counterfactual explanation generation",
                    "Business insight extraction"
                ],
                outputs: ["interpretability report", "explanation visualizations", "business insights"],
                validation: ["explanation consistency", "insight actionability", "stakeholder understanding"]
            },
            model_validation: {
                step_number: 6,
                description: "Validate model in business context",
                activities: [
                    "Out-of-time validation",
                    "Business KPI impact assessment",
                    "A/B testing framework design",
                    "Model robustness testing",
                    "Sensitivity analysis",
                    "Stakeholder validation sessions",
                    "Production readiness assessment"
                ],
                outputs: ["validation report", "business impact analysis", "deployment plan"],
                validation: ["real-world performance", "stakeholder approval", "production readiness"]
            }
        };
    }

    // 7. OUTPUT FORMATS SPECIFICATION
    defineOutputFormats() {
        return {
            charts: {
                exploratory: {
                    histograms: {
                        purpose: "Show distribution of numerical variables",
                        best_for: ["continuous variables", "identifying skewness", "outlier detection"],
                        specifications: ["bins selection", "overlay options", "statistical annotations"]
                    },
                    box_plots: {
                        purpose: "Display quartiles and outliers",
                        best_for: ["comparing groups", "outlier identification", "distribution summary"],
                        specifications: ["whisker definition", "outlier marking", "group comparison"]
                    },
                    scatter_plots: {
                        purpose: "Show relationships between variables",
                        best_for: ["correlation visualization", "trend identification", "cluster detection"],
                        specifications: ["color coding", "size mapping", "trend lines"]
                    },
                    correlation_heatmap: {
                        purpose: "Visualize variable relationships",
                        best_for: ["multivariate analysis", "feature selection", "collinearity detection"],
                        specifications: ["correlation method", "color scale", "clustering order"]
                    }
                },
                analytical: {
                    time_series: {
                        purpose: "Show temporal patterns and trends",
                        best_for: ["trend analysis", "seasonality detection", "forecasting"],
                        specifications: ["smoothing options", "decomposition", "confidence intervals"]
                    },
                    regression_plots: {
                        purpose: "Visualize model fit and residuals",
                        best_for: ["model diagnostics", "assumption checking", "prediction accuracy"],
                        specifications: ["fitted vs residual", "Q-Q plots", "prediction intervals"]
                    },
                    feature_importance: {
                        purpose: "Show variable importance in models",
                        best_for: ["model interpretation", "feature selection", "business insights"],
                        specifications: ["importance metric", "confidence intervals", "ranking"]
                    },
                    roc_curves: {
                        purpose: "Evaluate classification model performance",
                        best_for: ["binary classification", "threshold selection", "model comparison"],
                        specifications: ["AUC calculation", "optimal threshold", "comparison overlay"]
                    }
                }
            },
            tables: {
                summary_statistics: {
                    structure: ["variable", "count", "mean", "std", "min", "25%", "50%", "75%", "max"],
                    purpose: "Provide numerical summaries of data",
                    formatting: ["decimal precision", "missing value indicators", "outlier flags"]
                },
                correlation_matrix: {
                    structure: ["symmetric matrix", "correlation coefficients", "significance indicators"],
                    purpose: "Quantify variable relationships",
                    formatting: ["color coding", "significance levels", "diagonal handling"]
                },
                model_performance: {
                    structure: ["metric", "value", "confidence_interval", "benchmark_comparison"],
                    purpose: "Report model evaluation results",
                    formatting: ["metric definitions", "statistical significance", "business context"]
                },
                hypothesis_tests: {
                    structure: ["test", "statistic", "p_value", "conclusion", "effect_size"],
                    purpose: "Document statistical test results",
                    formatting: ["significance levels", "interpretation", "assumptions"]
                }
            },
            insights: {
                key_findings: {
                    format: "Executive summary of main discoveries",
                    components: ["headline insight", "supporting evidence", "business implication"],
                    length: "2-3 sentences per finding",
                    prioritization: "Impact and actionability"
                },
                recommendations: {
                    format: "Actionable business recommendations",
                    components: ["specific action", "expected outcome", "implementation steps"],
                    length: "Detailed enough for implementation",
                    prioritization: "ROI potential and feasibility"
                },
                technical_notes: {
                    format: "Methodological details and limitations",
                    components: ["methodology", "assumptions", "limitations", "future work"],
                    length: "Comprehensive documentation",
                    prioritization: "Reproducibility and transparency"
                }
            }
        };
    }

    // ENHANCED DATA ANALYSIS PROMPT OPTIMIZATION
    optimizeDataAnalysisPrompt(originalPrompt, config = {}) {
        const defaultConfig = {
            dataset_type: 'transactional',
            objective_type: 'descriptive',
            complexity_level: 'intermediate',
            output_preference: 'comprehensive',
            business_context: 'general'
        };

        const finalConfig = { ...defaultConfig, ...config };
        const systemPrompt = this.generateDataAnalysisSystemPrompt(finalConfig);

        return {
            systemPrompt: systemPrompt,
            optimizedPrompt: this.formatDataAnalysisPrompt(originalPrompt, finalConfig),
            configuration: finalConfig,
            structure: this.getDataAnalysisStructure(finalConfig)
        };
    }

    formatDataAnalysisPrompt(originalPrompt, config) {
        const datasetType = this.dataAnalysisConfig.datasetTypes[config.dataset_type];
        const objective = this.dataAnalysisConfig.analysisObjectives[config.objective_type];

        return `
# DATA ANALYSIS IMPLEMENTATION SPECIFICATION

## 1. DATASET DESCRIPTION
**Data Type**: ${config.dataset_type}
**Description**: ${datasetType.description}
**Characteristics**: ${datasetType.characteristics.join(', ')}
**Typical Size**: ${datasetType.typical_size}
**Common Fields**: ${datasetType.common_fields.join(', ')}
**Quality Concerns**: ${datasetType.data_quality_concerns.join(', ')}
**Preprocessing Needs**: ${datasetType.preprocessing_needs.join(', ')}

## 2. COLUMNS SUMMARY
**Expected Column Types**: Mixed (numerical continuous/discrete, categorical nominal/ordinal, temporal, text)
**Key Variables**: Primary metrics, dimensions, and identifiers relevant to analysis
**Data Quality Checks**: Missing value patterns, outlier detection, consistency validation
**Feature Engineering**: Derived variables, transformations, encoding strategies

## 3. OBJECTIVE
**Analysis Purpose**: ${objective.purpose}
**Key Questions**: 
${objective.key_questions.map(q => `- ${q}`).join('\n')}
**Expected Deliverables**: ${objective.deliverables.join(', ')}
**Success Metrics**: ${objective.success_metrics.join(', ')}

## 4. ASSUMPTIONS
**Data Quality Assumptions**:
- Data is representative and collected consistently
- Missing data patterns are identifiable and addressable
- Outliers can be distinguished from valid extreme values

**Statistical Assumptions**:
- Independence of observations (validated through testing)
- Appropriate distribution assumptions for chosen methods
- Sufficient sample size for robust inference

**Business Assumptions**:
- Current context and requirements are accurately captured
- Historical patterns provide insight for future decisions
- External factors remain relatively stable during analysis period

## 5. ANALYSIS TASKS
**Phase 1: Data Exploration**
- Comprehensive data profiling and quality assessment
- Univariate and bivariate analysis of key variables
- Pattern identification and anomaly detection

**Phase 2: Feature Engineering**
- Variable selection and transformation
- New feature creation and encoding
- Dimensionality optimization

**Phase 3: Statistical Analysis**
- Hypothesis testing for key business questions
- Regression analysis and correlation studies
- Statistical significance and effect size determination

**Phase 4: Predictive Modeling** (if applicable)
- Model selection and training
- Performance evaluation and validation
- Feature importance and interpretation

**Phase 5: Visualization and Communication**
- Chart creation for key findings
- Interactive dashboard development
- Executive summary preparation

## 6. MODELING STEPS
**Step 1: Data Preparation**
- Clean and validate data quality
- Handle missing values and outliers
- Create train/validation/test splits

**Step 2: Model Selection**
- Choose appropriate algorithms for objective
- Consider interpretability vs performance trade-offs
- Establish baseline performance metrics

**Step 3: Model Training**
- Implement cross-validation strategy
- Optimize hyperparameters systematically
- Prevent overfitting through regularization

**Step 4: Model Evaluation**
- Calculate comprehensive performance metrics
- Assess model bias and fairness
- Validate against business requirements

**Step 5: Model Interpretation**
- Generate global and local explanations
- Create feature importance rankings
- Extract actionable business insights

**Step 6: Model Validation**
- Conduct out-of-sample testing
- Assess real-world business impact
- Prepare for production deployment

## 7. OUTPUT FORMAT
**Charts and Visualizations**:
- Exploratory: histograms, box plots, scatter plots, correlation heatmaps
- Analytical: time series plots, regression diagnostics, feature importance charts
- Business: KPI dashboards, trend analyses, comparative studies

**Tables and Reports**:
- Summary statistics with confidence intervals
- Model performance metrics with benchmarks
- Hypothesis test results with interpretations
- Business recommendations with supporting evidence

**Key Insights and Recommendations**:
- Executive summary of main findings (2-3 key insights)
- Actionable business recommendations with implementation guidance
- Technical documentation for reproducibility
- Future analysis suggestions and limitations

Based on the original request: "${originalPrompt}"

Create a comprehensive data analysis that follows this structured approach, ensuring each component is thoroughly addressed with appropriate methodologies, clear documentation, and actionable insights for business decision-making.
        `;
    }

    generateDataAnalysisSystemPrompt(config) {
        const datasetType = this.dataAnalysisConfig.datasetTypes[config.dataset_type];
        const objective = this.dataAnalysisConfig.analysisObjectives[config.objective_type];
        
        return `
# DATA ANALYSIS SYSTEM PROMPT

## ROLE DEFINITION
You are an expert data analyst and statistician specializing in ${config.dataset_type} data analysis for ${config.objective_type} objectives. Your expertise includes statistical analysis, machine learning, data visualization, and business insight generation.

## DATASET EXPERTISE
Working with: ${datasetType.description}
Key characteristics: ${datasetType.characteristics.join(', ')}
Expected data challenges: ${datasetType.data_quality_concerns.join(', ')}
Preprocessing requirements: ${datasetType.preprocessing_needs.join(', ')}

## ANALYSIS OBJECTIVE
Primary purpose: ${objective.purpose}
Key questions to address: ${objective.key_questions.slice(0, 2).join(', ')}
Expected deliverables: ${objective.deliverables.join(', ')}
Success measurement: ${objective.success_metrics.join(', ')}

## METHODOLOGICAL APPROACH
1. Conduct thorough data exploration and quality assessment
2. Apply appropriate statistical methods for data type and objective
3. Create meaningful visualizations that support findings
4. Generate actionable insights with business context
5. Document methodology and assumptions clearly
6. Provide recommendations with implementation guidance

## OUTPUT REQUIREMENTS
- Follow the 7-component data analysis structure
- Include comprehensive charts, tables, and insights
- Ensure statistical rigor and business relevance
- Provide clear interpretation of all results
- Document limitations and future work suggestions

## QUALITY STANDARDS
- Statistical significance testing where appropriate
- Clear documentation of assumptions and limitations
- Reproducible methodology with detailed steps
- Business-focused interpretation of technical results
- Professional visualization standards with proper labeling
`;
    }

    getDataAnalysisStructure(config) {
        return {
            datasetType: this.dataAnalysisConfig.datasetTypes[config.dataset_type],
            objective: this.dataAnalysisConfig.analysisObjectives[config.objective_type],
            assumptions: this.dataAnalysisConfig.assumptions,
            analysisTasks: this.dataAnalysisConfig.analysisTasks,
            modelingSteps: this.dataAnalysisConfig.modelingSteps,
            outputFormats: this.dataAnalysisConfig.outputFormats,
            systemPrompt: this.generateDataAnalysisSystemPrompt(config)
        };
    }

    // Auto-detection methods for data analysis
    detectDatasetType(prompt) {
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('transaction') || promptLower.includes('sales') || promptLower.includes('purchase')) {
            return 'transactional';
        } else if (promptLower.includes('customer') || promptLower.includes('demographic') || promptLower.includes('behavior')) {
            return 'customer';
        } else if (promptLower.includes('time series') || promptLower.includes('trend') || promptLower.includes('forecast')) {
            return 'time_series';
        } else if (promptLower.includes('survey') || promptLower.includes('feedback') || promptLower.includes('response')) {
            return 'survey';
        } else if (promptLower.includes('operation') || promptLower.includes('performance') || promptLower.includes('kpi')) {
            return 'operational';
        }
        
        return 'transactional'; // default
    }

    detectObjectiveType(prompt) {
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('predict') || promptLower.includes('forecast') || promptLower.includes('future')) {
            return 'predictive';
        } else if (promptLower.includes('why') || promptLower.includes('cause') || promptLower.includes('reason')) {
            return 'diagnostic';
        } else if (promptLower.includes('recommend') || promptLower.includes('optimize') || promptLower.includes('should')) {
            return 'prescriptive';
        } else if (promptLower.includes('compare') || promptLower.includes('difference') || promptLower.includes('versus')) {
            return 'comparative';
        }
        
        return 'descriptive'; // default
    }
}

// Integration with existing PromptEngine
if (typeof window !== 'undefined' && window.promptEngine) {
    window.promptEngine.dataAnalysisModeHandler = new DataAnalysisModeHandler();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataAnalysisModeHandler;
}