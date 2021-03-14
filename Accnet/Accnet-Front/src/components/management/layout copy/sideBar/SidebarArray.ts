export interface SidebarType {
  link: string;
  icon: string;
  name: string;
  featureName: string;
  priority: number;
}

export const managementList: Array<SidebarType> = [
  {
    link: "/management/survey/",
    icon: "simple-icon-note",
    name: "Survey Management",
    featureName: "SurveyManagement",
    priority: 6
  },
  {
    link: "/management/role/",
    icon: "iconsminds-network",
    name: "Role Management",
    featureName: "RoleManagement",
    priority: 6
  },
  {
    link: "/management/feature/",
    icon: "iconsminds-check",
    name: "Feature Management",
    featureName: "FeatureManagement",
    priority: 6
  },
  {
    link: "/management/user/",
    icon: "simple-icon-people",
    name: "User Management",
    featureName: "UserManagement",
    priority: 6
  },
  {
    link: "/management/invoice/",
    icon: "simple-icon-people",
    name: "Invoice Management",
    featureName: "InvoiceManagement",
    priority: 6
  },
  {
    link: "/management/message/",
    icon: "iconsminds-mail",
    name: "Message Management",
    featureName: "MessageManagement",
    priority: 6
  },
  {
    link: "/management/tax/",
    icon: "iconsminds-network",
    name: "Tax Management",
    featureName: "TaxManagement",
    priority: 6
  },
  {
    link: "/management/organization/",
    icon: "iconsminds-network",
    name: "Organization Management",
    featureName: "OrganizationManagement",
    priority: 6
  },
];
 