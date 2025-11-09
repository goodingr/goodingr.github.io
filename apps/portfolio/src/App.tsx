import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import type { ProjectDefinition } from './projects'
import { findProject, projects } from './projects'

const ProjectCard = ({ project }: { project: ProjectDefinition }) => (
  <article className="project-card">
    <div className="project-card__header">
      <p className="project-card__eyebrow">{project.status === 'coming-soon' ? 'Coming soon' : 'Available now'}</p>
      <h2>{project.title}</h2>
    </div>
    <p className="project-card__summary">{project.summary}</p>
    <ul className="project-card__tech">
      {project.tech.map(tech => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
    <Link to={`/projects/${project.slug}`} className="project-card__cta">
      Explore project →
    </Link>
  </article>
)

const ProjectGallery = () => (
  <section className="gallery">
    {projects.map(project => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </section>
)

const ProjectDetail = () => {
  const { slug } = useParams()
  const project = slug ? findProject(slug) : undefined

  if (!project) {
    return (
      <div className="detail detail--empty">
        <p>Project not found. Choose another experience from the list.</p>
        <Link to="/" className="detail__back">
          ← Back to gallery
        </Link>
      </div>
    )
  }

  return (
    <section className="detail">
      <div className="detail__header">
        <div>
          <p className="detail__eyebrow">Case Study</p>
          <h1>{project.title}</h1>
          <p className="detail__summary">{project.summary}</p>
          <div className="detail__tech">
            {project.tech.map(tech => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
        <Link to="/" className="detail__back">
          ← Back to gallery
        </Link>
      </div>
      <div className="detail__canvas">
        {project.Component ? (
          <project.Component />
        ) : (
          <div className="detail__placeholder">
            <p>This project is on its way. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}

const App = () => (
  <BrowserRouter>
    <div className="portfolio">
      <aside className="portfolio__sidebar">
        <p className="portfolio__eyebrow">Projects</p>
        <h1>Product Portfolio</h1>
        <p className="portfolio__summary">
          A collection of interactive builds demonstrating React craftsmanship, performance-focused UI, and thorough
          testing culture.
        </p>
        <nav className="portfolio__nav">
          {projects.map(project => (
            <Link key={project.slug} to={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="portfolio__main">
        <Routes>
          <Route index element={<ProjectGallery />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
)

export default App
