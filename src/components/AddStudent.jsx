import React, { useEffect, useState } from "react";
import { PersonAdd, Close } from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";
import ShowDialog from "./ShowDialog";
import { Student } from "../models/Student";
import { Guardian } from "../models/Guardian";
import { addStudent, editStudentInfo } from "../api/Service";

function AddStudent({
  show,
  close,
  setAlert,
  setShowAlert,
  type,
  editStudent,
  setEditStudent,
  guardiansEntry,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const { student, updateStudent } = Student();
  const { guardian, updateGuardian } = Guardian();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (!editStudent) return;

    setUpdate(true);
    updateGuardian({
      firstname: editStudent.guardian.firstname,
      mi: editStudent.guardian.mi,
      lastname: editStudent.guardian.lastname,
      phone: editStudent.guardian.phone,
      address: editStudent.guardian.address,
    });

    updateStudent({
      firstname: editStudent.firstname,
      mi: editStudent.mi,
      lastname: editStudent.lastname,
      grade_section: editStudent.grade_section,
      guardian_name: editStudent.guardian_name || "",
      guardian: editStudent.guardian,
      dateAdded: editStudent.dateAdded,
      studentId: editStudent.studentId,
      qr_data: editStudent.qr_data,
      gender: editStudent.gender,
    });
  }, [editStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const dialogCallback = async (selection) => {
    if (!selection) return;

    try {
      let tempS = student;
      let tempG = guardian;

      tempG["name"] = tempG.firstname + " " + tempG.mi + " " + tempG.lastname;
      tempS["guardian_name"] = tempG.name;
      tempS["guardian"] = tempG;

      if (update) {
        await editStudentInfo(editStudent.docId, tempS);
      } else {
        await addStudent(tempS);
      }

      setAlert({
        type: type.SUCCESS,
        message: !update
          ? "Student added to the record successfully."
          : "Student info updated successfully.",
        duration: 4000,
      });
      setShowAlert(true);
      clearForm();
    } catch (e) {
      console.log(e);
      setAlert({
        type: type.ERROR,
        message: !update
          ? "Failed to add student to the record."
          : "Failed to update student info.",
        duration: 4000,
      });
      setShowAlert(true);
    }
  };

  const clearForm = () => {
    updateStudent({
      firstname: "",
      mi: "",
      lastname: "",
      grade_section: "",
      guardian: {},
      guardian_name: "",
      gender: "",
    });

    updateGuardian({
      firstname: "",
      mi: "",
      lastname: "",
      address: "",
      phone: "",
    });

    setEditStudent(null);
    setUpdate(false);
    close(false);
  };

  return (
    <>
      {show && (
        <div className="z-20 absolute h-full w-full bg-[#f5f7f8]/80">
          <div className="w-full h-full flex items-center justify-center px-2">
            <div className="flex flex-col p-6 w-[460px] h-[560px] bg-white border shadow-sm rounded-lg text-[#607d8b] font-roboto">
              <div className="flex flex-row justify-between">
                <PersonAdd color="inherit" />
                <Close
                  onClick={() => {
                    clearForm();
                  }}
                  className="cursor-pointer"
                />
              </div>
              <h1 className="pt-4 pb-2 font-roboto-bold">
                {!update ? "Add new Student" : "Update Student"}
              </h1>
              <p className="text-sm">Please fill the information below.</p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col py-5 w-full gap-2 overflow-auto"
              >
                <div className="flex flex-row w-full gap-2">
                  <div className="flex-1">
                    <label className="py-1 text-xs font-roboto-bold">
                      First Name <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      value={student.firstname}
                      required
                      onChange={(e) => {
                        updateStudent({ firstname: e.target.value });
                      }}
                      type="text"
                      className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="py-1 text-xs font-roboto-bold">
                      M.I. <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      required
                      value={student.mi}
                      onChange={(e) => {
                        updateStudent({ mi: e.target.value });
                      }}
                      type="text"
                      className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Last Name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    required
                    value={student.lastname}
                    onChange={(e) => {
                      updateStudent({ lastname: e.target.value });
                    }}
                    type="text"
                    className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Gender <span className="text-[#dc2626]">*</span>
                  </label>
                  <Autocomplete
                    id="guardian-box"
                    required={true}
                    value={student.gender}
                    className="text-white"
                    options={["Male", "Female"]}
                    sx={{ width: "100%", height: "36px" }}
                    size="small"
                    inputValue={student.gender}
                    onInputChange={(event, newInputValue) => {
                      updateStudent({ gender: newInputValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Grade & Section <span className="text-[#dc2626]">*</span>
                  </label>
                  <Autocomplete
                    id="guardian-box"
                    required={true}
                    value={student.grade_section}
                    className="text-white"
                    options={[
                      "Grade 11 - ABM",
                      "Grade 11 - HUMSS",
                      "Grade 11 - STEM",
                      "Grade 11 - TVL - CSS",
                      "Grade 11 - TVL - SMAW",
                      "Grade 11 - TVL - EIM",
                      "Grade 11 - TVL - House Keeping",
                      "Grade 11 - TVL - Cookery",
                      "Grade 11 - Tourism",
                      "Grade 11 - BPP/FBS",
                      "Grade 12 - ABM",
                      "Grade 12 - HUMSS",
                      "Grade 12 - STEM",
                      "Grade 12 - TVL - CSS",
                      "Grade 12 - TVL - SMAW",
                      "Grade 12 - TVL - EIM",
                      "Grade 12 - TVL - House Keeping",
                      "Grade 12 - TVL - Cookery",
                      "Grade 12 - Tourism",
                      "Grade 12 - BPP/FBS",
                    ]}
                    sx={{ width: "100%", height: "36px" }}
                    size="small"
                    inputValue={student.grade_section}
                    onInputChange={(event, newInputValue) => {
                      updateStudent({ grade_section: newInputValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <h1 className="pt-2 font-roboto-bold">Student Guardian</h1>
                <div className="flex flex-row w-full gap-2">
                  <div className="flex-1">
                    <label className="py-1 text-xs font-roboto-bold">
                      First Name <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      value={guardian.firstname}
                      required
                      onChange={(e) => {
                        updateGuardian({ firstname: e.target.value });
                      }}
                      type="text"
                      className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="py-1 text-xs font-roboto-bold">
                      M.I. <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      required
                      value={guardian.mi}
                      onChange={(e) => {
                        updateGuardian({ mi: e.target.value });
                      }}
                      type="text"
                      className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Last Name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    required
                    value={guardian.lastname}
                    onChange={(e) => {
                      updateGuardian({ lastname: e.target.value });
                    }}
                    type="text"
                    className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Phone Number <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    required
                    value={guardian.phone}
                    onChange={(e) => {
                      updateGuardian({ phone: e.target.value });
                    }}
                    type="text"
                    className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="py-1 text-xs font-roboto-bold">
                    Address <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    required
                    value={guardian.address}
                    onChange={(e) => {
                      updateGuardian({ address: e.target.value });
                    }}
                    type="text"
                    className="w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2"
                  />
                </div>
                <div className="flex flex-row w-full py-6 justify-end text-white text-sm font-roboto-bold gap-2">
                  <button
                    type="submit"
                    className="w-20 h-8 bg-[#49a54d] rounded-md"
                  >
                    {!update ? "Add" : "Update"}
                  </button>
                  <button
                    onClick={() => {
                      clearForm();
                    }}
                    type="reset"
                    className="w-20 h-8 text-[#607d8b] rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
                <ShowDialog
                  title={!update ? "Add Student" : "Update Student"}
                  description={`Are you sure you want to ${
                    !update ? "add" : "update"
                  } student?`}
                  open={showDialog}
                  close={setShowDialog}
                  callback={dialogCallback}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddStudent;
