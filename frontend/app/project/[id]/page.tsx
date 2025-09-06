import { ProjectDetailView } from "@/components/project/project-detail-view"

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetailView projectId={params.id} />
}
