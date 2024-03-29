// React and Next imports
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

// Libraries imports
import Swal from 'sweetalert2'

import { AiOutlineUser as User } from 'react-icons/ai'
import { FaUserAlt as About } from 'react-icons/fa'

// Firebase
import useUser, { USER_STATES } from 'hooks/useUser'
import { queryUserProfile, updateUserProfile } from 'firebase/client'

// Icons
import { AiOutlineClose } from 'react-icons/ai'


export default function index() {
  const user = useUser()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    profileId: '',
    name: '',
    school: '',
    committee: '',
    grade: '',
    group: '',
    age: '',
    phone: '',
    email: '',
    role: '',
  })

  useEffect(() => {
    user === USER_STATES.NOT_LOGGED && router.replace('/login')
  }, [user])

  useEffect(() => {
    let unsuscribe

    if (user) {
      queryUserProfile(user.uid, (profile) => {
        if (profile) {
          unsuscribe = setProfileData({
            ...profileData,
            profileId: profile.profileId,
            name: profile.name,
            school: profile.school,
            committee: profile.committee,
            grade: profile.grade,
            group: profile.group,
            age: profile.age,
            phone: profile.phone,
            email: profile.email,
            role: profile.role,
          })
        }
      })

      if (!user.emailVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Verifica tu email',
          text: 'Si no lo encuentras, revisa en el spam',
        })
      }
    }

    return () => unsuscribe && unsuscribe()
  }, [user])

  const handleInputChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateUserProfile({
      profileId: profileData.profileId,
      name: profileData.name,
      school: profileData.school,
      committee: profileData.committee,
      grade: profileData.grade,
      group: profileData.group,
      age: profileData.age,
      phone: profileData.phone,
      email: profileData.email,
    })
      .then(() => {
        user.updateProfile({
          displayName: profileData.name,
        })

        Swal.fire({
          icon: 'success',
          title: 'Datos guardados con éxito',
          text: '¡Ahora tu perfil está actualizado!',
        })
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar los datos',
          text: 'Por favor intente más tarde',
        })
        console.error(error)
      })
  }

  return (
    <div className="profileWrapper">
      <Head>
        <title> Perfil | Aztecmun 2021 </title>
      </Head>

      {user && (
        <div className="profile">
          <Link href="/">
            <div className="closeProfile"> <AiOutlineClose /> </div>
          </Link>

          <div className="profile__pic">
            <User className="pic" />
          </div>

          <div className="profile__info">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="top">
                <input
                  name="name"
                  className="name"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  value={profileData.name}
                />

                {(profileData.school === 'Plantel Azteca' ||
                  profileData.school === '') && (
                    <select
                      className="school"
                      name="school"
                      onChange={handleInputChange}
                    >
                      <option disabled selected value="">
                        Selecciona tu escuela
                    </option>
                      <option value="Plantel Azteca"> Plantel Azteca </option>
                      <option value="Otra"> Otra </option>

                      {profileData.school !== '' && (
                        <option
                          hidden
                          disabled
                          selected
                          value={profileData.school}
                        >
                          {profileData.school}
                        </option>
                      )}
                    </select>
                  )}

                {profileData.school !== 'Plantel Azteca' && (
                  <input
                    name="school"
                    className="c2"
                    type="text"
                    placeholder="Ingresa tu escuela"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.school}
                  />
                )}

                {profileData.role === 'delegate' && (
                  <select
                    className="committee"
                    name="committee"
                    onChange={handleInputChange}
                  >
                    <option disabled selected value="">
                      Selecciona un comité
                    </option>
                    <option value="Corte Internacional de Justicia">
                      Corte Internacional de Justicia
                    </option>
                    <option value="Senado de la República">
                      Senado de la República
                    </option>
                    <option value="World Tourism Organization">
                      World Tourism Organization
                    </option>
                    <option value="United Nations Children's Fund">
                      United Natios Children's Fund
                    </option>

                    {profileData.committee !== '' && (
                      <option
                        hidden
                        disabled
                        selected
                        value={profileData.committee}
                      >
                        {profileData.committee}
                      </option>
                    )}
                  </select>
                )}

                {profileData.role === 'secretariat' && (
                  <input
                    name="committee"
                    className="c2"
                    type="text"
                    placeholder="Ingresa tu secretaría"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.committee}
                  />
                )}
              </div>
              <div className="about">
                <div className="icon">
                  <About /> Información
                </div>

                <div className="contact">
                  <p className="c1">Grado: </p>
                  <select
                    className="c2"
                    name="grade"
                    onChange={handleInputChange}
                  >
                    <option disabled selected value="">
                      Selecciona tu grado
                    </option>
                    <option value="Primero de Secundaria">
                      Primero de Secundaria
                    </option>
                    <option value="Segundo de Secundaria">
                      Segundo de Secundaria
                    </option>
                    <option value="Tercero de Secundaria">
                      Tercero de Secundaria
                    </option>
                    <option value="Primer semestre de Bachillerato">
                      Primer semestre de Bachillerato
                    </option>
                    <option value="Segundo semestre de Bachillerato">
                      Segundo semestre de Bachillerato
                    </option>
                    <option value="Tercer semestre de Bachillerato">
                      Tercer semestre de Bachillerato
                    </option>
                    <option value="Cuarto semestre de Bachillerato">
                      Cuarto semestre de Bachillerato
                    </option>
                    <option value="Quinto semestre de Bachillerato">
                      Quinto semestre de Bachillerato
                    </option>
                    <option value="Sexto semestre de Bachillerato">
                      Sexto semestre de Bachillerato
                    </option>
                    <option value="Universidad">Universidad</option>

                    {profileData.grade !== '' && (
                      <option
                        hidden
                        disabled
                        selected
                        value={profileData.grade}
                      >
                        {profileData.grade}
                      </option>
                    )}
                  </select>

                  <p className="c1">Grupo: </p>
                  <input
                    name="group"
                    className="c2"
                    type="text"
                    placeholder="Ingresa tu grupo"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.group}
                  />

                  <p className="c1">Edad: </p>
                  <input
                    name="age"
                    className="c2"
                    type="number"
                    placeholder="Ingresa tu edad"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.age}
                  />

                  <p className="c1">Teléfono: </p>
                  <input
                    name="phone"
                    className="c2"
                    type="number"
                    placeholder="Ingresa tu teléfono"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.phone}
                  />

                  <p className="c1">Email: </p>
                  <input
                    name="email"
                    className="c2"
                    type="email"
                    placeholder="Ingresa tu email"
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    value={profileData.email}
                  />
                </div>
              </div>
              <button>Actualizar perfil</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}