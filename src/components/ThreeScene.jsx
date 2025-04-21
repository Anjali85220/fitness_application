import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { evaluatePose } from '../hooks/useExerciseRules'

function ThreeScene({ poseResults, exercise }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const annotationsRef = useRef([])

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)
    
    camera.position.z = 5
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!poseResults || !exercise || !sceneRef.current) return

    // Clear previous annotations
    annotationsRef.current.forEach(obj => {
      sceneRef.current.remove(obj)
    })
    annotationsRef.current = []

    // Evaluate pose to get 3D annotations
    const { annotations } = evaluatePose(poseResults.poseLandmarks, exercise)
    
    // Add new annotations to the scene
    annotations.forEach(annotation => {
      if (annotation.type === 'arrow') {
        const dir = new THREE.Vector3(...annotation.direction).normalize()
        const origin = new THREE.Vector3(...annotation.position)
        const length = annotation.length || 1
        const hex = annotation.color || 0xff0000
        
        const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex)
        sceneRef.current.add(arrowHelper)
        annotationsRef.current.push(arrowHelper)
      } else if (annotation.type === 'text') {
        const loader = new THREE.TextureLoader()
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 128
        const context = canvas.getContext('2d')
        context.fillStyle = annotation.backgroundColor || 'rgba(0,0,0,0.7)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.font = '24px Arial'
        context.fillStyle = annotation.color || '#ffffff'
        context.fillText(annotation.text, 10, 50)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ map: texture })
        const sprite = new THREE.Sprite(material)
        sprite.position.set(...annotation.position)
        sprite.scale.set(0.5, 0.25, 1)
        
        sceneRef.current.add(sprite)
        annotationsRef.current.push(sprite)
      }
    })

    // Animate
    const animate = () => {
      requestAnimationFrame(animate)
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    animate()
  }, [poseResults, exercise])

  return <div ref={mountRef} className="three-container" />
}

export default ThreeScene