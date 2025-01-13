"use client";
import Image from "next/image";
import React, { useState } from "react";

import Cookies from "universal-cookie";

import { useTranslation } from "react-i18next";
import i18n from "./util/i18n";

import { db } from "./lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { fileToBase64 } from "./util/fileToBase64";

const PetRegistrationForm: React.FC = () => {
  const cookies = new Cookies(null, { path: "/" });
  const [isModalSuccess, setIsModalSuccess] = useState<boolean>(false);
  const [isModalError, setIsModalError] = useState<boolean>(false);
  const [isModalErrorSubmit, setIsModalErrorSubmit] = useState<boolean>(false);
  const { t } = useTranslation("");

  const [language, setLanguage] = useState<"th" | "en" | null>("th");

  const [currentStep, setCurrentStep] = useState<number>(0);
  //step 1 User Info
  const [FirstName, setFirstName] = useState<string | null>("");
  const [LastName, setLastName] = useState<string | null>("");
  const [Age, setAge] = useState<number>(0);
  const [Gender, setGender] = useState<string | null>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>("");
  //step 2 Contact Info
  const [Address, setAddress] = useState<string | null>("");
  const [Phone, setPhone] = useState<string | null>("");
  const [Email, setEmail] = useState<string | null>("");
  const [HomeType, setHomeType] = useState<string | null>("");

  const switchLanguage = () => {
    setLanguage(language === "th" ? "en" : "th");
    i18n.changeLanguage(String(language === "th" ? "en" : "th"));
    cookies.set("Language", language === "th" ? "en" : "th");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setPreview("");
  };

  const validateStep = () => {
    if (
      currentStep === 0 &&
      (!FirstName || !LastName || Age <= 0 || !Gender || !selectedImage)
    ) {
      setIsModalError(true);
      return false;
    }
    if (currentStep === 1 && (!Address || !Phone || !Email || !HomeType)) {
      setIsModalError(true);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    let imageURL = null;

    if (selectedImage) imageURL = await fileToBase64(selectedImage);

    try {
      const userCollection = collection(db, "registration");
      await addDoc(userCollection, {
        FirstName: FirstName,
        LastName: LastName,
        Age: Age,
        Gender: Gender,
        Image: imageURL,
        Address: Address,
        Phone: Phone,
        Email: Email,
        HomeType: HomeType,
        createdAt: new Date(),
      });
      // alert("Register Successfully!");
      setIsModalSuccess(true);
    } catch (error) {
      // alert("Error");
      setIsModalErrorSubmit(true);
      console.error(error);
    }
  };

  const handleSaveForm = () => {
    cookies.set("FirstName", String(FirstName));
    cookies.set("LastName", String(LastName));
    cookies.set("Age", Number(Age));
    cookies.set("Gender", String(Gender));
    cookies.set("Address", String(Address));
    cookies.set("Phone", String(Phone));
    cookies.set("Email", String(Email));
    cookies.set("HomeType", String(HomeType));
  };

  // const methodRead = async () => {
  //   const res = await fetch("/api/tasks", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const returnData = await res.json();
  // };

  // const methodCreate = async () => {
  //   const res = await fetch("/api/tasks", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  //   const returnData = await res.json();
  // };

  // const methodUpdate = async () => {
  //   const res = await fetch("/api/tasks", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  //   const returnData = await res.json();
  // };

  // const methodDelete = async () => {
  //   const res await fetch("/api/tasks", {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  //   const returnData = await res.json();
  // };

  const loadOld = async () => {
    setFirstName(await cookies.get("FirstName"));
    setLastName(await cookies.get("LastName"));
    setAge(await cookies.get("Age"));
    setGender(await cookies.get("Gender"));
    setAddress(await cookies.get("Address"));
    setPhone(await cookies.get("Phone"));
    setEmail(await cookies.get("Email"));
    setHomeType(await cookies.get("HomeType"));
    setLanguage((await cookies.get("Language")) || "th");
    i18n.changeLanguage(await cookies.get("Language"));
  };

  const [cold, setCold] = useState<boolean>(false);
  if (cold == false) {
    loadOld();
    setCold(true);
  }

  return (
    <div className="relative w-full md:w-1/3 mx-0 md:mx-auto text-white bg-gradient-to-b from-yellow-700 to-yellow-900 rounded-3xl shadow">
      <div className="absolute top-4 left-4">
        <button
          type="button"
          onClick={switchLanguage}
          className="text-xl w-10 h-10 font-extrabold text-black rounded-full bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage:
              language === "th" ? "url('asset/TH.png')" : "url('asset/EN.png')",
          }}
        ></button>
      </div>
      <button
        onClick={handleSaveForm}
        type="button"
        className="top-0 right-0 rounded-bl-3xl rounded-tr-3xl px-4 py-2 absolute bg-green-500"
      >
        {/* บันทึกแบบฟอร์ม */}
        {t("save_form")}
      </button>
      <Image
        src={"/asset/banner.jpg"}
        alt="banner"
        width={1280}
        height={1024}
        className="rounded-t-3xl"
      />
      {currentStep === 2 ? (
        <div className="flex flex-col px-6 my-4 ">
          <h1 className="text-3xl font-bold text-center my-4">
            {/* ข้อมูล */}
            {t("info")}
          </h1>
        </div>
      ) : (
        <div className="flex flex-col px-6 my-4">
          <h1 className="text-3xl font-bold text-center my-4 whitespace-pre-line">
            {/* {`ลงทะเบียน\nอุปการะสัตว์เลี้ยง`} */}
            {t("register_pet_adoption")}
          </h1>
          <span className="whitespace-pre-line">
            {/* {`กรอกข้อมูล ( สำหรับการตรวจสอบ )`} */}
            {t("fill_information")}
          </span>
        </div>
      )}
      <form className="px-6 pb-6">
        {currentStep === 0 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* ชื่อ */}
                  {t("first_name")}
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={FirstName || undefined}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                />
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* นามสกุล */}
                  {t("last_name")}
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={LastName || undefined}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* อายุ */}
                  {t("age")}
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={Age || undefined}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                />
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* เพศ */}
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={Gender || undefined}
                  onChange={(e) => setGender(e.target.value)}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                >
                  <option value="">
                    {/* เลือก */}
                    {t("select")}
                  </option>
                  <option value="male">
                    {/* ชาย */}
                    {t("male")}
                  </option>
                  <option value="female">
                    {/* หญิง */}
                    {t("female")}
                  </option>
                  <option value="other">
                    {/* อื่น ๆ */}
                    {t("other")}
                  </option>
                </select>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              {/* อัปโหลดรูปภาพตัวเอง */}
              {t("upload_self_image")}
            </h1>
            <div className="relative bg-white rounded-xl shadow-lg shadow-black/25 p-2 md:p-6 w-full">
              <button
                onClick={handleDeleteImage}
                type="button"
                className="top-0 right-0 rounded-bl-3xl rounded-tr-xl px-4 py-2 absolute bg-red-500"
              >
                {/* ลบ */}
                {t("delete")}
              </button>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 md:p-6 text-center text-gray-500 hover:bg-gray-100 transition duration-300"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full object-cover rounded-md"
                    />
                  ) : (
                    <span>
                      {/* คลิกเพื่อเลือกรูป */}
                      {t("click_to_select_image")}
                    </span>
                  )}
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {selectedImage && (
                <p className="text-sm text-gray-500 text-center">
                  {selectedImage.name}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 items-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* ที่อยู่ ( ปัจจุบัน ) */}
                  {t("current_address")}
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={Address || undefined}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border px-4 py-2 w-full max-h-24 min-h-24 overflow-hidden rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900 whitespace-pre-line"
                  required
                />
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* เบอร์โทรศัพท์ */}
                  {t("phone_number")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={Phone || undefined}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                />
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* อีเมล */}
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={Email || undefined}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-4 py-2 w-full rounded-xl shadow-lg shadow-black/25 text-black outline-2 outline-yellow-900"
                  required
                />
              </div>
            </div>
            <label className="block mb-2">
              {/* ประเภทที่อยู่ */}
              {t("address_type")}
            </label>
            <div className="grid grid-cols-3 text-lg text-center">
              <label className="flex flex-col items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="Home"
                  checked={HomeType === "Home"}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="h-4 w-4"
                />
                <span>
                  {/* บ้าน */}
                  {t("house")}
                </span>
              </label>

              <label className="flex flex-col items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="apartment"
                  checked={HomeType === "apartment"}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="h-4 w-4"
                />
                <span>
                  {/* อพาร์ทเมนต์ */}
                  {t("apartment")}
                </span>
              </label>

              <label className="flex flex-col items-center">
                <input
                  type="radio"
                  name="homeType"
                  value="dormitory"
                  checked={HomeType === "dormitory"}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="h-4 w-4"
                />
                <span>
                  {/* หอพัก */}
                  {t("dormitory")}
                </span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4 text-center text-xl">
            <div className="p-4 border-dashed border-4 border-white/50 rounded-lg">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-60 object-cover rounded-md shadow-lg shadow-black/25"
                />
              ) : (
                <img
                  src="/asset/404.jpg"
                  alt="Preview"
                  className="w-full h-60 object-cover rounded-md shadow-lg shadow-black/25"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* ชื่อ */}
                  {t("first_name")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {FirstName}
                </div>
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* นามสกุล */}
                  {t("last_name")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {LastName}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 s-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* อายุ */}
                  {t("age")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {Age}
                </div>
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* เพศ */}
                  {t("gender")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {Gender == "male"
                    ? t("male")
                    : Gender == "female"
                    ? t("female")
                    : t("other")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 items-center">
              <div className="inline">
                <label className="block mb-2">
                  {/* ที่อยู่ ( ปัจจุบัน ) */}
                  {t("current_address")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {Address}
                </div>
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* เบอร์โทรศัพท์ */}
                  {t("phone_number")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {Phone}
                </div>
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* อีเมล */}
                  {t("email")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {Email}
                </div>
              </div>
              <div className="inline">
                <label className="block mb-2">
                  {/* ประเภทที่อยู่ */}
                  {t("address_type")}
                </label>
                <div className="px-4 py-2 text-xl text-center w-full border-dashed border-4 border-white/50 rounded-xl bg-black/25 shadow-lg shadow-black/25 text-white">
                  {HomeType == "home"
                    ? t("house")
                    : HomeType == "apartment"
                    ? t("apartment")
                    : t("dormitory")}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex ${
            currentStep == 0 ? "justify-end" : "justify-between"
          } mt-6`}
        >
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-black px-4 py-2 rounded-full"
            >
              {/* ย้อนกลับ */}
              {t("back")}
            </button>
          )}
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              {/* ถัดไป */}
              {t("next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              {/* ส่งข้อมูล */}
              {t("submit")}
            </button>
          )}
        </div>
      </form>
      {isModalError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col justify-center gap-4 items-center bg-white rounded-lg text-black shadow-lg max-w-md w-full p-6">
            <h1 className="text-2xl font-semibold">
              {t("please_fill_in_information")}
            </h1>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              onClick={() => setIsModalError(false)}
            >
              {t("ok")}
            </button>
          </div>
        </div>
      )}
      {isModalSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col justify-center gap-4 items-center bg-white rounded-lg text-black shadow-lg max-w-md w-full p-6">
            <h1 className="text-2xl font-semibold">{t("register_success")}</h1>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              onClick={() => setIsModalSuccess(false)}
            >
              {t("ok")}
            </button>
          </div>
        </div>
      )}
      {isModalErrorSubmit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col justify-center gap-4 items-center bg-white rounded-lg text-black shadow-lg max-w-md w-full p-6">
            <h1 className="text-2xl font-semibold">{t("error")}</h1>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              onClick={() => setIsModalErrorSubmit(false)}
            >
              {t("ok")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetRegistrationForm;
