export const attendee = {
    "fields": [
      {
        "name": "fullName",
        "label": "Full Name",
        "type": "text",
        "validation": "required",
        "outputPath": "user.name"
      },
      {
        "name": "birthday",
        "label": "Birthday",
        "type": "date",
        "validation": "required",
        "outputPath": "user.birthday"
      },
      {
        "name": "age",
        "label": "Age",
        "type": "number",
        "min": 18,
        "max": 99,
        "validation": "required",
        "outputPath": "user.age"
      },
      {
        "name": "email",
        "label": "Email Address",
        "type": "text",
        "validation": "required",
        "outputPath": "user.email"
      },
      {
        "name": "attendeeType",
        "label": "Attendee Type",
        "type": "select",
        "validation": "required",
        "outputPath": "attendee.type",
        "options": [
          {
            "value": "guest",
            "label": "Guest"
          },
          {
            "value": "speaker",
            "label": "Speaker"
          },
          {
            "value": "sponsor",
            "label": "Sponsor"
          }
        ]
      },
      {
        "name": "interests",
        "label": "Select at least 3 interests",
        "type": "select",
        "validation": "required",
        "show": [
          {
            "field": "attendeeType",
            "equals": "guest"
          } 
        ],
        "multiple": true,
        "min": 3,
        "outputPath": "user.interests",
        "options": [
          {
            "value": "webDev",
            "label": "Web Development"
          },
          {
            "value": "mobileApps",
            "label": "Mobile App Development"
          },
          {
            "value": "aiMl",
            "label": "AI & Machine Learning"
          },
          {
            "value": "cloudComputing",
            "label": "Cloud Computing"
          },
          {
            "value": "cybersecurity",
            "label": "Cybersecurity"
          },
          {
            "value": "dataScience",
            "label": "Data Science"
          },
          {
            "value": "blockchain",
            "label": "Blockchain Technology"
          },
          {
            "value": "arVr",
            "label": "Augmented & Virtual Reality (AR/VR)"
          }
        ]
      },
      {
        "name": "sessions",
        "label": "Select at least 2 talks to attend",
        "type": "select",
        "validation": "required",
        "multiple": true,
        "outputPath": "attendee.talks",
        "min": 2,
        "options": [
          {
            "value": "ethicalTech",
            "label": "Discussion: Ethics in Technology (10:00 - 11:00)"
          },
          {
            "value": "cloudInnovations",
            "label": "Seminar: Innovations in Cloud Computing (11:30 - 12:20)"
          },
          {
            "value": "panelDiscussion",
            "label": "Panel Discussion: The Future of Tech (14:00 - 14:40)"
          },
          {
            "value": "blockchainApplications",
            "label": "Workshop: Practical Blockchain Applications (14:20 - 15:30)"
          },
          {
            "value": "vrForEducation",
            "label": "Seminar: VR Applications in Education (15:30 - 16:00)"
          },
          {
            "value": "uxDesignPrinciples",
            "label": "Talk: UX Design Principles for Developers (16:10 - 16:50)"
          },
          {
            "value": "workshopWeb",
            "label": "Workshop: Advanced Web Development (17:00 - 17:45)"
          },
        ],
        "show": [
          {
            "field": "attendeeType",
            "equals": "guest"
          } 
        ],
      },    
      {
        "name": "tShirtSize",
        "label": "T-Shirt Size",
        "type": "select",
        "validation": "required",
        "outputPath": "attendee.shirtSize",
        "show": [
          {
            "field": "attendeeType",
            "equals": "guest"
          } 
        ],
        "options": [
          {
            "value": "S",
            "label": "Small"
          },
          {
            "value": "M",
            "label": "Medium"
          },
          {
            "value": "L",
            "label": "Large"
          },
          {
            "value": "XL",
            "label": "Extra Large"
          }
        ]
      },
      {
        "name": "sponsorName",
        "label": "Sponsor Name",
        "type": "text",
        "outputPath": "sponsor.name",
        "validation": "required",
        "show": [
          {
            "field": "attendeeType",
            "equals": "sponsor"
          } 
        ],
      }
    ]
}