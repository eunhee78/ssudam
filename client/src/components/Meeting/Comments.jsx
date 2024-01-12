import classes from "../../styles/components/Comments.module.css";
import footerLogo from "../../images/footerLogo.png";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "../../axios";
const Comments = (props) => {
  const [commentLikes, setCommentLikes] = useState({});
  console.log(props.comments);
  // const commentsLength = props.comments.length;
  useEffect(() => {
    // comments 배열이 변경될 때마다 댓글 좋아요 상태 초기화
    const initialCommentLikes = {};
    if (props.comments) {
      props.comments.forEach((comment) => {
        axios
          .get(
            `/v1/likes/comments/${comment.commentId}/like-status?memberId=${props.loggedInUser.id}`
          )

          .then((response) => {
            if (response.data === true) {
              setCommentLikes((prevState) => ({
                ...prevState,
                [comment.commentId]: true,
              }));
            } else {
              setCommentLikes((prevState) => ({
                ...prevState,
                [comment.commentId]: false,
              }));
            }
          })
          .catch((error) => {
            console.error("Error getting likes data: ", error);
            alert("오류가 발생했습니다!");
          });
      });
    }
  }, [props.comments]);

  const likeHandler = (commentId) => {
    // 댓글 좋아요 상태 토글
    setCommentLikes((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));

    // 좋아요 요청 보내기
    axios
      .post(`/v1/likes/comments/${commentId}?memberId=${props.loggedInUser.id}`)
      .then((response) => {
        // 성공적으로 처리된 경우의 로직을 작성하세요.
        console.log(response);
      })
      .catch((error) => {
        console.error("Error liking comment data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  const [sortOption, setSortOption] = useState("recent");
  const [sortedComments, setSortedComments] = useState([]);

  useEffect(() => {
    // 최신 순으로 정렬
    if (sortOption === "recent" && props.comments) {
      const sortedByRecent = [...props.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedComments(sortedByRecent);
    }
    // 좋아요 순으로 정렬
    else if (sortOption === "likes" && props.comments) {
      const sortedByLikes = [...props.comments].sort(
        (a, b) => b.likeCount - a.likesCount
      );
      setSortedComments(sortedByLikes);
    }
  }, [props.comments, sortOption]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  // useEffect(() => {
  //   axios
  //     .post(
  //       `/v1/likes/comments/${commentId}/like-status?memberId=${props.loggedInUser.memberId}`
  //     )

  //     .then((response) => {
  //       if (response.data === true) {
  //         setCommentLikes((prevState) => ({
  //           ...prevState,
  //           [commentId]: true,
  //         }));
  //       } else {
  //         setCommentLikes((prevState) => ({
  //           ...prevState,
  //           [commentId]: false,
  //         }));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error getting likes data: ", error);
  //       alert("오류가 발생했습니다!");
  //     });
  // }, []);
  return (
    <div className={classes.comments}>
      <div className={classes.dropdown}>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="recent">최신 순</option>
          <option value="likes">좋아요 순</option>
        </select>
      </div>
      {!props.isLoading &&
        props.comments &&
        sortedComments.map((comment) => {
          return (
            <div key={comment.commentId} className={classes.comm}>
              <div className={classes.info}>
                <img
                  alt="ProfileImage"
                  src={footerLogo}
                  width="50px"
                  height="50px"
                />
                <div className={classes.user}>
                  <div>{comment.nickname}</div>{" "}
                  <div>
                    {new Date(comment.createdAt).toLocaleString("ko-KR")}{" "}
                  </div>
                </div>
              </div>

              <div className={classes.commcontent}>
                {comment.comment}{" "}
                <div
                  className={classes.likes}
                  onClick={() => {
                    likeHandler(comment.commentId);
                  }}
                >
                  <FaThumbsUp
                    style={{
                      fontSize: "1.5rem",
                      color: commentLikes[comment.commentId]
                        ? "green"
                        : "black",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default Comments;
