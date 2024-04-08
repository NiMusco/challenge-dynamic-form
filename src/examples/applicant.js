export const applicant = {
  "fields": [
    {
      "name": "applicantName",
      "label": "Name",
      "type": "text",
      "validation": "required",
      "outputPath": "applicant.name"
    },
    {
      "name": "applicantEmail",
      "label": "Email",
      "type": "text",
      "validation": "required",
      "outputPath": "applicant.email"
    },
    {
      "name": "positionType",
      "label": "Position",
      "type": "select",
      "validation": "required",
      "outputPath": "job.positionType",
      "options": [
        {
          "value": "fullTime",
          "label": "Full Time"
        },
        {
          "value": "partTime",
          "label": "Part Time"
        },
        {
          "value": "internship",
          "label": "Internship"
        }
      ]
    },
    {
      "name": "linkedinLink",
      "label": "Linkedin URL",
      "type": "text",
      "validation": "required",
      "outputPath": "applicant.resume"
    },
    {
      "name": "portfolioLink",
      "label": "Portfolio or Github URL",
      "type": "text",
      "outputPath": "applicant.portfolio",
    },
    {
      "name": "availableStartDate",
      "label": "Available Start Date",
      "type": "date",
      "validation": "required",
      "outputPath": "job.startDate"
    },
    {
      "name": "salaryExpectations",
      "label": "Salary Expectations",
      "type": "number",
      "outputPath": "job.salary"
    },
    {
      "name": "internshipType",
      "label": "Internship Type",
      "type": "select",
      "validation": "required",
      "outputPath": "job.internshipType",
      "show": [
        {
          "field": "positionType",
          "equals": "internship"
        }
      ],
      "options": [
        {
          "value": "summer",
          "label": "Summer Internship"
        },
        {
          "value": "winter",
          "label": "Winter Internship"
        }
      ]
    },
  ]
}
