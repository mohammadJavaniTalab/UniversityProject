import { pathProject } from "../../../../service/constants/defaultValues";

export const pages: SideBarManagement = [
  {
    path: pathProject.management.tax,
    icon: "fas fa-file-contract",
    name: "Taxes",
    subName: "",
  },

  {
    path: pathProject.management.invoice,
    icon: "fas fa-file-invoice-dollar",
    name: "Invoices",
    subName: "",
  },

  {
    path: pathProject.management.appointment,
    icon: "fa fa-calendar",
    name: "Consultation",
    subName: "",
  },
  
  {
    path: pathProject.management.marketing,
    icon: "fa fa-trademark",
    name: "Marketing",
    subName: "",
  },
  {
    path: pathProject.management.consultation_Exception,
    icon: "fa fa-calendar",
    name: "Consultation Exception",
    subName: "",
  },
  {
    path: pathProject.management.user,
    icon: "fas fa-user-edit",
    name: "Users",
    subName: "",
  },
  {
    path: pathProject.management.ticket,
    icon: "fas fa-headset",
    name: "Support Tickets",
    subName: "",
  },
  {
    path: pathProject.management.linkedUser,
    icon: "fa fa-link icon",
    name: "Link",
    subName: "Account",
  },

  {
    path: pathProject.management.survey,
    icon: "fas fa-poll",
    name: "Survey",
    subName: "",
  },
  {
    path: pathProject.management.message,
    icon: "fa fa-comment-alt",
    name: "Messages",
    subName: "",
  },
  {
    path: pathProject.management.role,
    icon: "fas fa-user-tag",
    name: "Roles",
    subName: "",
  },
  {
    path: pathProject.management.feature,
    icon: "fas fa-user-cog",
    name: "Features",
    subName: "",
  },
];
export type SideBarPages = {
  path: string;
  icon: string;
  name: string;
  subName: string;
};
export type SideBarManagement = Array<SideBarPages>;
