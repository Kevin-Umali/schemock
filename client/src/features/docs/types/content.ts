export interface GuideStep {
  title: string
  description: string
}

export interface GuideEndpoint {
  format: string
  method: 'POST'
  path: string
  description: string
}

export interface GuideNavItem {
  href: string
  label: string
}
