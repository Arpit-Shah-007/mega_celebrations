import type { FaqItem } from "@/types"

/**
 * Categories, questions, and answers copied verbatim from the live site's FAQ
 * page (extracted from the accordion markup's schema.org Question/Answer
 * itemprops, which hold the full real text even while visually collapsed).
 */
export const faqs: FaqItem[] = [
  {
    category: "Booking An Event",
    question: "How do I book an event?",
    answer:
      "To book add all the packages and add ons you are interested in to your wishlist, then submit your wishlist. Please make sure you include your event start time, location, and any other important information such as venue restrictions, theme customization and any other request.\nWe will then put together a quote for you. Once you receive your quote you have 48 hours to make your deposit and sign your contract.",
  },
  {
    category: "Booking An Event",
    question: "What type of deposit is needed?",
    answer: "A 25% non-refundable deposit is required in order to secure your date. The remaining balance is due 2 weeks before your event.",
  },
  {
    category: "Booking An Event",
    question: "What if I don't have a final guest count yet?",
    answer:
      "We recommend booking for the maximum number of guests that you may have as we can not guarantee that additional items will be available. You have up until 2 weeks before your event (when your final payment is due) to make any changes.",
  },
  {
    category: "Booking An Event",
    question: "Are there any additional fees?",
    answer:
      "Below is a list of fees that may be associated with your order:\nTravel Fee (for all events more than 20 miles outside of Flemington, NJ)\nAdditional Set Up Fee (stairs, walking distances further than 100 feet, etc.)\nAfter Hours Pick Up (for events requiring pickup after 9:00pm, 11:00pm for MEGA Movie Night Packages)\nRush Fee (for events booked less than 10 days in advance)",
  },
  {
    category: "Booking An Event",
    question: "I don't see the theme I am looking for. Can you customize?",
    answer:
      "Yes, we can absolutely help you create the perfect theme for your event. Additional fees apply for all custom themes. Fee varies based on theme, number of guests and the amount of decor. Please inquire for a quote.",
  },
  {
    category: "Booking An Event",
    question: "When is the final payment due?",
    answer: "Your final payment is due 2 weeks prior to your event.",
  },
  {
    category: "Event Location",
    question: "Where can I hold my event?",
    answer:
      "Currently, we are only servicing private residences or venues. We do not serve public parks or beaches at this time.\nIf you are looking to hold an event at a beach or park please check out our DIY Picnic Package.",
  },
  {
    category: "Event Location",
    question: "Can all packages be set up outdoors?",
    answer:
      "Only certain packages are offered outdoors. Please see the list below:\nOutdoor Packages\nMEGAGlampOut, MEGALounge, Celebrations Picnic, Farm Table Dining, Dining in the Tent, MEGAMovie Night, Date Night GlampOut/ Date Night Picnic, Pamper Party\nIndoor Packages\nTent Sleepover, Canopy Sleepover, Lace Teepee Sleepover, Celebrations Picnic, Date Night Picnic, Canopy Lounge, Farm Table Dining, Pamper Party",
  },
  {
    category: "Event Location",
    question: "Can you set up upstairs or down a hill, etc?",
    answer:
      "You must notify us if there are stairs (5+ stairs) or large hills leading to the set up location or any other obstacles that may impede set up. You must also let us know if there is over 100ft from parking to the set up area. Additional set up fees will apply.",
  },
  {
    category: "Event Location",
    question: "What areas do you service?",
    answer:
      "We service Central New Jersey as well as parts of North Jersey, the Jersey Shore, Eastern PA, and Staten Island.\nWe are located in Flemington, NJ. Events over 20 miles from Flemington will be charged a Travel Fee based on location.",
  },
  {
    category: "Set Up & Pick Up",
    question: "How much space is needed?",
    answer:
      "The amount of space needed varies by package. Please see below for dimensions for each package:\nIndoor Sleepovers and Lounges\nTent Sleepover- Each A-Frame Tent set up requires approximately a 3ft by 6ft space\nLace Teepee Sleepover- Each Teepee set up requires approximately a 3.5ft by 6.5ft space\nOutdoor Sleepovers and Lounges\nStandard MEGALounge & MEGA GlampOut- 5M MEGATent- Requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter)\nDeluxe MEGALounge & MEGA GlampOut- 6M MEGATent- Requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)\nThe MEGATent must be set up on a flat grass surface. Non grass surfaces (pavement, stone, turf, sand, etc.) will require sandbags for an additional fee of $150. This must be disclosed at the time of booking.\nDining\nCelebrations Picnics- We recommend a 8ft x 10ft space for a table of 8. Please contact us for exact dimensions for larger parties.\nFarm Table Dining- Each Farm Table is 8ft x 3ft.\nDining in the Tent- 5M MEGATent requires a 25ft by 25ft grass area for staking (actual tent is 17ft diameter); 6M MEGATent requires a 32ft by 32ft grass area for staking (actual tent is 20ft in diameter)",
  },
  {
    category: "Set Up & Pick Up",
    question: "Will you help move furniture?",
    answer: "The set up area must be cleared upon our arrival. All furniture must be moved beforehand. We cannot help move furniture.",
  },
  {
    category: "Set Up & Pick Up",
    question: "When do you come to set up/pick up?",
    answer:
      "You will receive a confirmation email one week prior to your event with a 2 hour delivery and pick up window. We base our schedule on your event start/end time provided at time of booking, location, package, etc.\nDeliveries: Deliveries will begin at 8:00am for outdoor events and 9:00am for indoor events and go throughout the day. All sleepover packages will be set up by 4:00pm. Some deliveries may take place the day prior to your event depending on the schedule for that particular date.\nPick Ups: All Sleepover Packages- Pick ups will begin at 10:00am the next day and go throughout the day. All MEGATent Packages- Pick ups will begin at 8:00am the next day and go throughout the day. Picnic Packages- pick up scheduling depends on guest counts, package type, location, weather and other scheduled events. Guaranteed specific delivery/pick up times may incur additional fees and must be requested via email no later than 2 weeks before your event.",
  },
  {
    category: "Set Up & Pick Up",
    question: "Can I request a specific set up/pick up time?",
    answer:
      "We may be able to accommodate requests for specific delivery/pick up times if our schedule allows. However, it is not guaranteed. If you need a guaranteed specific delivery and/or pick up time additional fees may apply. Any request must be submitted via email no later than 2 weeks before your event.",
  },
  {
    category: "Set Up & Pick Up",
    question: "How long does the set up/ pick up take?",
    answer:
      "Set up takes on average 45 mins to 1.5 hours (may take longer for extra large packages) depending on the size of the package and set up location. Pickups generally take a little less time.",
  },
  {
    category: "Set Up & Pick Up",
    question: "Do I need to be home for set up/pickup?",
    answer:
      "You do not need to be home for outdoor set ups/pick ups. You can let us know where you would like everything set up beforehand and we will take care of the rest. You must be present for indoor set ups.",
  },
  {
    category: "Weather",
    question: "Is the MEGATent waterproof?",
    answer:
      "Our MEGATent is waterproof and can be used in the rain. In the event of thunderstorms or high winds it is not safe to use the tent.\nClient is responsible for ensuring that windows and doors to the tent are closed while raining to ensure no there is no damage to the items inside the tent. Failure to do so may result in the loss of your security deposit.",
  },
  {
    category: "Weather",
    question: "What happens if there is inclement weather?",
    answer:
      "We highly suggest you have a back up plan for all outdoor events in case of inclement weather. Back up plans can include:\nMoving your picnic indoors\nSetting up your picnic under a covered area (provided by the client) such as a covered porch, canopy, pop up tent, etc.\nUpgrade your package to one of our Dining in the Tent options (pending availability)\nFor GlampOuts- switch to an indoor sleepover option (pending availability)\nYou also do have the option to reschedule for another date pending availability. You must notify us a minimum of 24 hours before your scheduled delivery window in order to reschedule.",
  },
  {
    category: "Weather",
    question: "Can I schedule a rain/snow date?",
    answer:
      "We can not hold a rain/snow date. In the event that you need to reschedule at the last minute due to inclement weather we will do everything we can to accommodate the new date but in some cases it may not be possible (especially during the busy summer season). We highly suggest having a back up plan in case of rain.",
  },
  {
    category: "Policies",
    question: "What happens if I need to cancel my event?",
    answer:
      "Cancellation 2 Weeks +\nIf you have to cancel or reschedule your event your 25% deposit may be used as a credit towards a new event within 13 months of your original event date. In addition, you are entitled to a refund of any amount paid above the 25% deposit.\nCancellations within 2 Weeks\nIf you are canceling your event within 2 weeks, your full payment may be used as a credit towards a new event within 13 months of your original event date.\nCancellations within 24 hours\nIf you are canceling your event within 24 hours of your scheduled delivery time, your full payment, minus a rescheduling fee, may be used as a credit towards a new event within 13 months of your original event date.",
  },
  {
    category: "Policies",
    question: "Can I reschedule my event?",
    answer:
      "Yes, you can reschedule your event pending availability. You must notify us a minimum of 24 hours before your scheduled delivery time in order to reschedule without a rescheduling fee.",
  },
  {
    category: "Policies",
    question: "Can guests eat and drink in the tents?",
    answer:
      "Light snacks and clear liquids are allowed in all our indoor tents, outdoor tents and canopy. We ask that you refrain from any foods/drinks that are mess prone and may cause stains. You are responsible for any damages/stains caused from foods and drinks.",
  },
  {
    category: "Policies",
    question: "When will I get my damage deposit back?",
    answer:
      "Your damage deposit will be refunded the Monday after your event as long as all inventory is returned free from any damage.\nDamage includes but is not limited to any of the following: stains, broken inventory, missing pieces, and water damage (including damage from tents being left open and items being left out in the rain and/or overnight).\nPlease note damage deposits are only charged for OUTDOOR events.",
  },
]

export const faqCategories = ["Booking An Event", "Event Location", "Set Up & Pick Up", "Weather", "Policies"] as const
