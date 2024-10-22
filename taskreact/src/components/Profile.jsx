import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: localStorage.getItem("email") || "", // Usar 'email' en lugar de 'email'
    gender: "",
    profileImage: "",
    bio: "",
    nickname: "",
    birthdate: "",
    location: "",
    interests: "",
    favoriteColor: "",
    favoriteFood: "",
    socialMediaLinks: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Usar 'token' en lugar de 'token'
      const email = localStorage.getItem("email"); // Usar 'email'

      // Mostrar en consola el token y el email para depurar
      console.log("Token:", token);
      console.log("Email:", email);

      if (token) {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile((prevProfile) => ({
            ...prevProfile,
            name: data.name || "",
            email: email || "", // Asegura que el email se mantenga
            gender: data.gender || "",
            profileImage: data.profileImage || "",
            bio: data.bio || "",
            nickname: data.nickname || "",
            birthdate: data.birthdate || "",
            location: data.location || "",
            interests: data.interests || "",
            favoriteColor: data.favoriteColor || "",
            favoriteFood: data.favoriteFood || "",
            socialMediaLinks: data.socialMediaLinks || "",
          }));
          setImagePreview(data.profileImage || "");
        } else {
          console.error("Error al obtener el perfil");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Asegúrate de tener el token para la autenticación

    if (!token) {
      console.error("Token no encontrado. Debes iniciar sesión");
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT", // Usar método PUT para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar token para la autenticación
        },
        body: JSON.stringify(profile), // Enviar el perfil actualizado
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Perfil actualizado con éxito:", data);
        // Mostrar algún mensaje de éxito o redirigir si es necesario
      } else {
        console.error("Error al actualizar el perfil");
        // Manejar el error, como mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error("Error de red:", error);
      // Manejar el error, como mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center mb-6">
        <div className="relative">
          <img
            src={imagePreview || "/default-profile.png"}
            alt="Imagen de perfil"
            className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md object-cover"
          />
          {/* El botón está ahora debajo de la imagen */}
          <div className="mt-3 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="upload-image"
              className="hidden"
            />
            <label
              htmlFor="upload-image"
              className="cursor-pointer text-white bg-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
            >
              Cambiar Foto
            </label>
          </div>
        </div>
        <div className="ml-6">
          <h1 className="text-3xl font-bold">
            {profile.name || "Nombre del Usuario"}
          </h1>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Biografía</label>
          <textarea
            value={profile.bio}
            name="bio"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md w-full"
            rows="3"
            placeholder="Escribe algo sobre ti..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Apodo</label>
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
              placeholder="Tu apodo o nombre de usuario"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Género</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
            >
              <option value="">Seleccione...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthdate"
              value={profile.birthdate}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Ubicación</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
              placeholder="Tu ubicación"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Intereses</label>
          <input
            type="text"
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md w-full"
            placeholder="Tus intereses o pasatiempos"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Color Favorito</label>
          <input
            type="text"
            name="favoriteColor"
            value={profile.favoriteColor}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md w-full"
            placeholder="Tu color favorito"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Comida Favorita</label>
          <input
            type="text"
            name="favoriteFood"
            value={profile.favoriteFood}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md w-full"
            placeholder="Tu comida favorita"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">
            Enlaces a Redes Sociales
          </label>
          <textarea
            name="socialMediaLinks"
            value={profile.socialMediaLinks}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md w-full"
            rows="2"
            placeholder="Enlaces a tus redes sociales (separados por comas)"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
};

export default Profile;
